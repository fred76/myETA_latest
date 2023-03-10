import { Injectable, NgZone } from '@angular/core';
import { formatDate } from '@angular/common';
import { MyElectronService } from './electron.service';
import { BunkerOption } from 'src/shared/schema/bunker.schema';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Rotation, ActivityPerLocation, Activity } from 'src/shared/schema/rotation.schema';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFsetup } from 'src/shared/entity/rotation-model';

@Injectable({
  providedIn: 'root'
})
export class RotationService {

  toMilliSecond: number = 3600000

  constructor(private appservice: MyElectronService, private zone: NgZone) { }

  bunkerOption$ = new BehaviorSubject<BunkerOption | null>(null);
  rotation$ = new BehaviorSubject<Rotation | null>(null);
  isShort$ = new BehaviorSubject<boolean>(false);
  noBunker$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  compactRotation() {
    let i = this.isShort$.getValue()
    i = !i
    this.isShort$.next(i)
  }

  addRotation(
    dateTime: Date,
    utc: number,
    robFO: number,
    robDO: number) {

    const rotation = this.rotation$.getValue()!
    if (rotation) {

      rotation.dateTime = dateTime
      rotation.utc = utc
      rotation.robFO = robFO
      rotation.robDO = robDO
      rotation.activityPerLocations = rotation.activityPerLocations
      this.saveCalculateNext(rotation)
      return
    }

    if (!rotation) {

      const t: Rotation = new Rotation()


      t.dateTime = dateTime
      t.utc = utc
      t.robFO = robFO
      t.robDO = robDO
      t.activityPerLocations = []
      this.rotation$.next(t)

      return
    }

  }

  addEmptyActivityPerLocation() {

    const rotation = this.rotation$.getValue()!

    let id = rotation.activityPerLocations?.length!

    let locAtc: ActivityPerLocation = new ActivityPerLocation()
    locAtc.idOrder = id

    locAtc.activities = []

    rotation.activityPerLocations?.push(locAtc)

    this.rotation$.next(rotation)
  }

  AddActivityPerLocation(
    id: number,
    port: string,
    pltStation: string,
    berth: string,
    utcTime: number) {

    const rotation = this.rotation$.getValue()!

    const r = rotation

    const t = r.activityPerLocations![id]
    t.port = port
    t.pltStation = pltStation
    t.berth = berth
    t.utcTime = utcTime

    if (t.activities === undefined) {
      t.activities = []
    }

    r.activityPerLocations![id] = t


    this.saveCalculateNext(r)


  }

  addActivity(
    id: number,
    act: Activity) {

    const r = this.rotation$.getValue()!

    const t = r.activityPerLocations![id]
    act.idOrder = t.activities?.length!
    t.activities?.push(act)
    this.saveCalculateNext(r)
  }

  editActivity(
    id: number,
    idAct: number,
    act: Activity) {
    const r = this.rotation$.getValue()!

    act.idOrder = idAct 
    console.log( r.activityPerLocations![id].activities!) 
    r.activityPerLocations![id].activities![idAct] = act
    this.saveCalculateNext(r)
  }

  deleteActivitey(index: number,
    idAct: number) {

    const r = this.rotation$.getValue()!
    r.activityPerLocations![index].activities!.splice(idAct, 1)

    this.reorderActivityID(r, index)

    this.saveCalculateNext(r)
  }

  deleteLocationActivitey(id: number) {
    const r = this.rotation$.getValue()!
    r.activityPerLocations!.splice(id, 1)
    this.reorderID(r)
    this.saveCalculateNext(r)
  }

  reorderID(rot: Rotation) {
    rot.activityPerLocations.map((a, i) => {
      a.idOrder = i
    })
  }

  reorderActivityID(rot: Rotation, indexLoc: number) {
    let arra = rot.activityPerLocations![indexLoc].activities!
    arra.map((a, i) => {
      a.idOrder = i
    })
  }

  moveDownLocationActivitey(index: number) {

    const r = this.rotation$.getValue()!

    if (r.activityPerLocations!.length - 1 === index) { return }

    let swap1 = index
    let swap2 = index + 1
    const rot = r
    let arra = rot.activityPerLocations!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp

    this.reorderID(r)

    this.saveCalculateNext(rot)
  }

  moveUPLocationActivitey(index: number) {
    const r = this.rotation$.getValue()!

    if (index === 0) { return }
    let swap1 = index
    let swap2 = index - 1
    
    const rot = r
    let arra = rot.activityPerLocations!


    console.log('move up prima' + arra[swap1].port + ' ' + arra[swap1].idOrder);
    console.log('move up prima' + arra[swap2].port + ' ' + arra[swap2].idOrder);
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp

    console.log('move up dopo' + arra[swap1].port + ' ' + arra[swap1].idOrder);
    console.log('move up dopo' + arra[swap2].port + ' ' + arra[swap2].idOrder);
    
    
    

    this.reorderID(r)
    this.saveCalculateNext(rot)
  }

  moveDownActivitey(index: number, indexLoc: number) {
    const r = this.rotation$.getValue()!

    if (r.activityPerLocations!.length - 1 === index) { return }

    let swap1 = index
    let swap2 = index + 1
    const rot = r
    let arra = rot.activityPerLocations![indexLoc].activities!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp
    this.reorderActivityID(r, indexLoc)
    this.saveCalculateNext(rot)
  }

  moveUpActivitey(index: number, indexLoc: number) {
    const r = this.rotation$.getValue()!

    if (index === 0) { return }
    let swap1 = index
    let swap2 = index - 1
    const rot = r
    let arra = rot.activityPerLocations![indexLoc].activities!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp
    this.reorderActivityID(r, indexLoc)
    this.saveCalculateNext(rot)
  }

  saveCalculateNext(rotation: Rotation) {
    this.timeCalculation()
    this.bunkerCalculation()
    this.rotation$.next(rotation)
    this.appservice.addRotation(rotation).then(p => {
      p
    })

  }

  timeCalculation() {

    const t = this.rotation$.getValue()!

    const startDate = t.dateTime!

    const startUTCinMillisecods = t.utc! * this.toMilliSecond

    const newDate = new Date(startDate);

    let startDateMilleseconds = 0

    const activityPerLoca = t.activityPerLocations!

    let deltaTime: number = 0

    let utcPrevious: number = 0

    activityPerLoca.map((p, i) => {

      let activity = p.activities

      const UTCMilliSecond = p.utcTime! * this.toMilliSecond

      activity?.map((act, i) => {

        i === 0 ? startDateMilleseconds = newDate.getTime() - startUTCinMillisecods : newDate.getTime()

        utcPrevious = UTCMilliSecond

        const duration = act.duration!

        const durationMilliSecond = duration * this.toMilliSecond

        deltaTime += durationMilliSecond

        let newEtaMillisecond: number = startDateMilleseconds + deltaTime + UTCMilliSecond

        act.date = this.dateConversionFromUnix(newEtaMillisecond)

      })
    })

    this.rotation$.next(t)

  }

  bunkerCalculation() {
    let t = this.rotation$.getValue()!
    const startFO = t.robFO!
    const startDO = t.robDO!

    const activityPerLoca = t.activityPerLocations!
    const bunker = this.bunkerOption$.getValue()!

    if (bunker === undefined) {
      return
    }

    let incrementalDeltaFO = 0
    let incrementalDeltaDO = 0

    activityPerLoca.map(p => {
      let act = p.activities
      act?.map((a, i) => {
        let b = this.bunkerCalculationPerActivity(a, bunker)

        incrementalDeltaFO += b.deltaFO
        incrementalDeltaDO += b.deltaDO

        a.robFO! = startFO - incrementalDeltaFO
        a.robDO! = startDO - incrementalDeltaDO
      })
    })
  }


  bunkerCalculationPerActivity(activity: Activity, bunker: BunkerOption): { deltaFO: number, deltaDO: number } {

    let deltaFO: number = 0
    let deltaDO: number = 0
    let ddggNumber: number = 0
    let meNumber: number = 0

    const me = this.meCalculation(activity, bunker)

    deltaFO += me.deltaFO
    deltaDO += me.deltaDO

    const ddgg = this.ddggCalculation(activity, bunker)
    deltaFO += ddgg.deltaFO
    deltaDO += ddgg.deltaDO


    const boilers = this.boilerCalculation(activity, bunker)
    deltaFO += boilers.deltaFO
    deltaDO += boilers.deltaDO

    activity.deltaFO = deltaFO
    activity.deltaDO = deltaDO
    activity.ddGGFONumber = ddgg.ddGGFONumber
    activity.ddGGDONumber = ddgg.ddGGDONumber
    activity.boilerFO = boilers.boilersNumberFO
    activity.boilerDO = boilers.boilersNumberDO
    activity.mainEngine = me.meNumber

    const restock = this.restockBunker(activity, bunker)
    deltaFO -= restock.deltaFO
    deltaDO -= restock.deltaDO


    return { deltaFO, deltaDO }


  }

  restockBunker(activity: Activity, bunker: BunkerOption): { deltaFO: number, deltaDO: number, } {


    if (activity.activityType === 'Bunkering') {

      return { deltaFO: activity.restockFo!, deltaDO: activity.restockDo! }
    }

    return { deltaFO: 0, deltaDO: 0, }
  }

  meCalculation(activity: Activity, bunker: BunkerOption): { deltaFO: number, deltaDO: number, meNumber: number } {

    if (activity.activityType === 'Canal Transit') {


      return { deltaFO: activity.foExtimatecConsumption!, deltaDO: activity.doExtimatecConsumption!, meNumber: 1 }
    }



    if (activity.activityType === 'Sea Passage') {

      let avg = this.meAvgCons(activity, bunker)

      if (activity.mainEngineFuel === 'fo') {
        return { deltaFO: avg.avgCons, deltaDO: 0, meNumber: 1 }
      }
      if (activity.mainEngineFuel === 'do') {
        return { deltaFO: 0, deltaDO: avg.avgCons, meNumber: 1 }
      }



    }
    if (activity.activityType === 'Drifting' || activity.activityType === 'Shifting' || activity.activityType === 'Pilotage Inbound' || activity.activityType === 'Pilotage Outbound') {

      let avg = this.meAvgCons(activity, bunker)

      if (activity.mainEngineFuel === 'fo') {
        return { deltaFO: avg.avgCons, deltaDO: 0, meNumber: 1 }
      }
      if (activity.mainEngineFuel === 'do') {
        return { deltaFO: 0, deltaDO: avg.avgCons, meNumber: 1 }
      }

    }

    return { deltaFO: 0, deltaDO: 0, meNumber: 1 }
  }

  ddggCalculation(activity: Activity, bunker: BunkerOption): {ddGGFONumber: number,ddGGDONumber: number, deltaFO: number, deltaDO: number } {

    let multiplierFO: number = 0
    let multiplierDO: number = 0

    const ddGGOne = activity.ddggOne
    const ddGGTwo = activity.ddggTwo
    const ddGGThree = activity.ddggThree 

    
    

    let deltaFO: number = 0
    let deltaDO: number = 0
    const ddGGBunkerCons = bunker.ddggDailyConsumption
    ddGGOne === 'fo' ? multiplierFO += 1 : null
    ddGGTwo === 'fo' ? multiplierFO += 1 : null
    ddGGThree === 'fo' ? multiplierFO += 1 : null
    ddGGOne === 'do' ? multiplierDO += 1 : null
    ddGGTwo === 'do' ? multiplierDO += 1 : null
    ddGGThree === 'do' ? multiplierDO += 1 : null 
 

    const deltaBunkerFO: number = ((ddGGBunkerCons * multiplierFO) / 24) * activity.duration!
    const deltaBunkerDO: number = ((ddGGBunkerCons * multiplierDO) / 24) * activity.duration!
    deltaFO = deltaBunkerFO
    deltaDO = deltaBunkerDO
 
 
    return { ddGGFONumber: multiplierFO,ddGGDONumber: multiplierDO, deltaFO: deltaFO, deltaDO: deltaDO }
  }

  boilerCalculation(activity: Activity, bunker: BunkerOption): { deltaFO: number, deltaDO: number, boilersNumberFO: number, boilersNumberDO: number } {

    const boilerMax = bunker.boilerMaxConsumption

    let boilerFO: number = 0
    let boilerDO: number = 0
    let boilerNFO: number = 0
    let boilerNDO: number = 0

    switch (activity.boilerOneFuel) {
       
      case 'fo':
        const consFO = (((boilerMax / 100) * activity.boilerOnePercentage!) / 24) * activity.duration!
        boilerFO += consFO; boilerDO += 0; boilerNFO += 1
        break
      case 'do':
        const consDO = (((boilerMax / 100) * activity.boilerOnePercentage!) / 24) * activity.duration!
        boilerFO += 0; boilerDO += consDO; boilerNDO += 1
    }

    switch (activity.boilerTwoFuel) {
     
      case 'fo':
        const consFO = (((boilerMax / 100) * activity.boilerTwoPercentage!) / 24) * activity.duration!
        boilerFO += consFO; boilerDO += 0; boilerNFO += 1
        break
      case 'do':
        const consDO = (((boilerMax / 100) * activity.boilerTwoPercentage!) / 24) * activity.duration!
        boilerFO += 0; boilerDO += consDO; boilerNDO += 1
    }

    switch (activity.boilerThreeFuel) {
      
      case 'fo':
        const consFO = (((boilerMax / 100) * activity.boilerThreePercentage!) / 24) * activity.duration!
        boilerFO += consFO; boilerDO += 0; boilerNFO += 1
        break
      case 'do':
        const consDO = (((boilerMax / 100) * activity.boilerThreePercentage!) / 24) * activity.duration!
        boilerFO += 0; boilerDO += consDO; boilerNDO += 1
    }




    return { deltaFO: boilerFO, deltaDO: boilerDO, boilersNumberFO: boilerNFO, boilersNumberDO: boilerNDO }
  }

  meAvgCons(activity: Activity, bunker: BunkerOption): { avgCons: number } {

    const mainEngineFuel = activity.mainEngineFuel


    if (activity.speed! === undefined) {

      const avgConsDaily = bunker.ballastCruise + (((bunker.laddenCruise - bunker.ballastCruise) / 100) * activity.laddenPercentage!)

      const avgCons = (avgConsDaily / 24) * activity.duration!

      return { avgCons: avgCons }


    }


    if ((activity.speed! < bunker.speed40)) {

      const avgConsDaily = bunker.ballast40 + (((bunker.ladden40 - bunker.ballast40) / 100) * activity.laddenPercentage!)

      const avgCons = (avgConsDaily / 24) * activity.duration!

      return { avgCons: avgCons }

    }

    if ((activity.speed! >= bunker.speed40 && activity.speed! <= bunker.speed60)) {

      const deltaSpeed60_40: number = bunker.speed60 - bunker.speed40
      const ConsBallastDifference: number = bunker.ballast60 - bunker.ballast40
      const ConsLaddenDifference: number = bunker.ladden60 - bunker.ladden40

      let deltaSpeed = activity.speed! - bunker.speed40
      let speedIndex = deltaSpeed / deltaSpeed60_40
      let ballastDeltaConsumpition = ConsBallastDifference * speedIndex
      let consBallastAtSpeed = bunker.ballast40 + ballastDeltaConsumpition

      let laddenDeltaConsumpition = ConsLaddenDifference * speedIndex
      let ConsladdenAtSpeed = bunker.ladden40 + laddenDeltaConsumpition

      const avgConsDaily = consBallastAtSpeed + (((ConsladdenAtSpeed - consBallastAtSpeed) / 100) * activity.laddenPercentage!)

      const avgCons = (avgConsDaily / 24) * activity.duration!

      return { avgCons: avgCons }

    }

    if ((activity.speed! > bunker.speed60 && activity.speed! <= bunker.speed80)) {

      const speedDifference: number = bunker.speed80 - bunker.speed60
      const ConsBallastDifference: number = bunker.ballast80 - bunker.ballast60
      const ConsLaddenDifference: number = bunker.ladden80 - bunker.ladden60

      let deltaSpeed = activity.speed! - bunker.speed60
      let speedIndex = deltaSpeed / speedDifference
      let ballastDeltaConsumpition = ConsBallastDifference * speedIndex
      let consBallastAtSpeed = bunker.ballast60 + ballastDeltaConsumpition

      let laddenDeltaConsumpition = ConsLaddenDifference * speedIndex
      let ConsladdenAtSpeed = bunker.ladden60 + laddenDeltaConsumpition

      const avgConsDaily = consBallastAtSpeed + (((ConsladdenAtSpeed - consBallastAtSpeed) / 100) * activity.laddenPercentage!)

      const avgCons = (avgConsDaily / 24) * activity.duration!

      return { avgCons: avgCons }

    }


    if ((activity.speed! > bunker.speed80 && activity.speed! <= bunker.speedCruise)) {

      const speedDifference: number = bunker.speedCruise - bunker.speed80
      const ConsBallastDifference: number = bunker.ballastCruise - bunker.ballast80
      const ConsLaddenDifference: number = bunker.laddenCruise - bunker.ladden80

      let deltaSpeed = activity.speed! - bunker.speed80
      let speedIndex = deltaSpeed / speedDifference
      let ballastDeltaConsumpition = ConsBallastDifference * speedIndex
      let consBallastAtSpeed = bunker.ballast80 + ballastDeltaConsumpition

      let laddenDeltaConsumpition = ConsLaddenDifference * speedIndex
      let ConsladdenAtSpeed = bunker.ladden80 + laddenDeltaConsumpition

      const avgConsDaily = consBallastAtSpeed + (((ConsladdenAtSpeed - consBallastAtSpeed) / 100) * activity.laddenPercentage!)

      const avgCons = (avgConsDaily / 24) * activity.duration!

      return { avgCons: avgCons }

    }

    if ((activity.speed! > bunker.speedCruise)) {

      const avgConsDaily = bunker.ballastCruise + (((bunker.laddenCruise - bunker.ballastCruise) / 100) * activity.laddenPercentage!)

      const avgCons = (avgConsDaily / 24) * activity.duration!

      return { avgCons: avgCons }

    }

    return { avgCons: 0 }

  }

  dateConversion(date: string): string {
    let newDate = new Date(date);
    let g = newDate.getTime()
    const format = 'dd-MM-yyyy HH:mm';
    const locale = 'en-UK';
    return formatDate(g, format, locale);
  }

  dateConversionFromUnix(date: number): string {
    const format = 'dd-MM-yyyy HH:mm';
    const locale = 'en-UK';
    return formatDate(date, format, locale);
  }


  fullRotation(
    pdfSetup: PDFsetup
  ) {
    const doc = new jsPDF({
      orientation: "landscape"
    });
    let t = this.rotation$.getValue()!
    const format = 'dd-MM-yyyy HH:mm';
    const locale = 'en-UK';
    const formattedDate = formatDate(t.dateTime, format, locale);
    doc.text('Start ETA Calculation @ ' + formattedDate + ' LT', 10, 10);
    doc.text('UTC: ' + t.utc.toString(), 140, 10);
    doc.text('ROB FO: ' + t.robFO.toString(), 170, 10);
    doc.text('ROB DO: ' + t.robDO.toString(), 210, 10);
    t.activityPerLocations.map((a, i) => {
      pdfSetup.byPort ? doc.addPage() : null
      let heads: any = []
      let headerTop = [
        {
          content: ['Port of: ' + a.port + ' -  Berth: ' + a.berth + ' -  UTC: ' + a.utcTime + ' HRS'],
          colSpan: 10,
          styles: { fillColor: [22, 160, 133] },

        },
      ]
      let headerBottomDefault = ['Activityd', ' - ', 'Date & Time']

      pdfSetup.expectedTime ? headerBottomDefault.push('Expected Time') : null
      pdfSetup.ladden ? headerBottomDefault.push('Ladden @ %') : null
      pdfSetup.cargo ? headerBottomDefault.push('Cargo in MT') : null
      pdfSetup.robFO ? headerBottomDefault.push('ROB FO') : null
      pdfSetup.robDO ? headerBottomDefault.push('ROB DO') : null
      pdfSetup.restockFO ? headerBottomDefault.push('Restock DO') : null
      pdfSetup.restockDO ? headerBottomDefault.push('Resotck FO') : null


      heads.push(headerTop)
      heads.push(headerBottomDefault)
      let arrayOfArrayValueActivity: any[] = []

      a.activities.map((p, i) => {
        let arrayOfValueActivity: any[] = []
        let arrayOfAgentctivity: any[] = []

        if (
          (pdfSetup.seaPassage ? p.activityType === 'Sea Passage' : null)
          || (pdfSetup.pilotageInbound ? p.activityType === 'Pilotage Inbound' : null)
          || (pdfSetup.pilotageOutbound ? p.activityType === 'Pilotage Outbound' : null)
          || (pdfSetup.loading ? p.activityType === 'Loading' : null)
          || (pdfSetup.discharging ? p.activityType === 'Discharging' : null)
          || (pdfSetup.tankCleaning ? p.activityType === 'Tank Cleaning' : null)
          || (pdfSetup.shifting ? p.activityType === 'Shifting' : null)
          || (pdfSetup.laybyBerth ? p.activityType === 'Layby Berth' : null)
          || (pdfSetup.bunkering ? p.activityType === 'Bunkering' : null)
          || (pdfSetup.anchoring ? p.activityType === 'Anchoring' : null)
          || (pdfSetup.drifting ? p.activityType === 'Drifting' : null)
          || (pdfSetup.canalTransit ? p.activityType === 'Canal Transit' : null)


        ) {

          if (p.activityType === 'Sea Passage') { 
            const eca = p.ECA === 'isECA' ? "ECA" : ''
            const eosp = p.EoSP === 'isEoSP' ? "EoSP" : '' 
            arrayOfValueActivity.push(p.activityType + ' ' + eca + ' ' + eosp )
          }else {
            arrayOfValueActivity.push(p.activityType)
          }
          arrayOfValueActivity.push(p.ETX)
          arrayOfValueActivity.push(p.date + ' LT')
          pdfSetup.expectedTime ? arrayOfValueActivity.push((Math.round(p.duration * 100) / 100).toFixed(1) + ' HRS') : null
          pdfSetup.ladden ? arrayOfValueActivity.push(p.laddenPercentage) : null
          pdfSetup.cargo ? arrayOfValueActivity.push(p.cargoOnBoardMT) : null
          pdfSetup.robFO ? arrayOfValueActivity.push((Math.round(p.robFO * 100) / 100).toFixed(1) + ' MT') : null
          pdfSetup.robDO ? arrayOfValueActivity.push((Math.round(p.robDO * 100) / 100).toFixed(1) + ' MT') : null
          pdfSetup.restockFO ? arrayOfValueActivity.push(p.restockFo + ' MT') : null
          pdfSetup.restockDO ? arrayOfValueActivity.push(p.restockDo + ' MT') : null
          arrayOfArrayValueActivity.push(arrayOfValueActivity)
          if (p.agency && pdfSetup.agency) {
            arrayOfAgentctivity.push({ content: p.agency.agencyName, colSpan: 3 })
            arrayOfAgentctivity.push({ content: p.agency.agencyGeneralEmail, colSpan: 3 })
            arrayOfAgentctivity.push({ content: p.agency.agencyCell24Hrs, colSpan: 3 })
            arrayOfArrayValueActivity.push(arrayOfAgentctivity)
          }


        }
      })

      autoTable(doc, {
        head: heads,
        body: arrayOfArrayValueActivity,
        theme: 'striped',
      })

    });
    doc.save('FullRotation.pdf')
    // doc.save('Instruction.pdf');
  }



  exportRotation() {
    const t = this.rotation$.getValue()!
    this.appservice.exportRotation(t)
  }
  importRotation() {
    this.appservice.importRotation().subscribe(p => {
      this.zone.run(() => {
        this.rotation$.next(p.rot.rotation)
        this.bunkerOption$.next(p.rot.bunker[0])
      });

    })


  }
}
