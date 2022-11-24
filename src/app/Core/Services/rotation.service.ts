import { Injectable } from '@angular/core';
// import { ActivityModel, ActivityPerLocationModel, RotationModel } from 'src/shared/entity/rotation-model';
import { formatDate } from '@angular/common';
import { MyElectronService } from './electron.service';
import { BunkerOption } from 'src/shared/schema/bunker.schema';
import { BehaviorSubject } from 'rxjs';
import { Rotation, ActivityPerLocation, Activity } from 'src/shared/schema/rotation.schema';

@Injectable({
  providedIn: 'root'
})
export class RotationService {

  rotation: Rotation 
  toMilliSecond: number = 3600000

  constructor(private appservice: MyElectronService) {

    this.getBunker()

  }

  bunker: BunkerOption

  bunkerOption$ = new BehaviorSubject<BunkerOption | null>(null);
  rotation$ = new BehaviorSubject<Rotation | null>(null);

  getBunker() {
    this.appservice.getBunker().then(bunker => {
      this.bunker = bunker
      this.bunkerOption$.next(bunker)
    })
  }


  addRotation(
    dateTime: Date,
    utc: number,
    robFO: number,
    robDO: number) {


    if (this.rotation.activityPerLocations?.length! > 0) {
      this.rotation.dateTime = dateTime
      this.rotation.utc = utc
      this.rotation.robFO = robFO
      this.rotation.robDO = robDO
      this.rotation.activityPerLocations = this.rotation.activityPerLocations
       this.saveCalculateNext(this.rotation)


    } else {
      this.rotation.dateTime = dateTime
      this.rotation.utc = utc
      this.rotation.robFO = robFO
      this.rotation.robDO = robDO
      this.rotation.activityPerLocations = []
      this.rotation$.next(this.rotation)

    }




  }

  addEmptyActivityPerLocation() {

    let id = this.rotation.activityPerLocations?.length!

    let locAtc: ActivityPerLocation = new ActivityPerLocation()

    this.rotation.activityPerLocations?.push(locAtc)

    this.rotation$.next(this.rotation)
  }



  AddActivityPerLocation(
    id: number,
    port: string,
    pltStation: string,
    berth: string,
    utcTime: number) {

    const r = this.rotation

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
    const r = this.rotation

    const t = r.activityPerLocations![id] 
    
    t.activities?.push(act)
    this.saveCalculateNext(r)
  }
  editActivity(
    id: number,
    idAct: number,
    act: Activity) {

    this.rotation!.activityPerLocations![id].activities![idAct] = act
    this.saveCalculateNext(this.rotation)

  }

  deleteActivitey(index: number,
    idAct: number) {
    this.rotation!.activityPerLocations![index].activities!.splice(idAct, 1)
    this.saveCalculateNext(this.rotation)
  }
  deleteLocationActivitey(id: number) {
    this.rotation!.activityPerLocations!.splice(id, 1)
   
    this.saveCalculateNext(this.rotation)
  }
  moveDownLocationActivitey(index: number) {

    if (this.rotation!.activityPerLocations!.length - 1 === index) { return }

    let swap1 = index
    let swap2 = index + 1
    const rot = this.rotation
    let arra = rot.activityPerLocations!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp

    this.saveCalculateNext(rot)
  }
  moveUPLocationActivitey(index: number) {

    if (index === 0) { return }
    let swap1 = index
    let swap2 = index - 1
    const rot = this.rotation
    let arra = rot.activityPerLocations!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp

    this.saveCalculateNext(rot)
  }

  moveDownActivitey(index: number, indexLoc: number) {

    if (this.rotation!.activityPerLocations!.length - 1 === index) { return }

    let swap1 = index
    let swap2 = index + 1
    const rot = this.rotation
    let arra = rot.activityPerLocations![indexLoc].activities!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp

    this.saveCalculateNext(rot)
  }
  moveUpActivitey(index: number, indexLoc: number) {

    if (index === 0) { return }
    let swap1 = index
    let swap2 = index - 1
    const rot = this.rotation
    let arra = rot.activityPerLocations![indexLoc].activities!
    var temp = arra[swap1];
    arra[swap1] = arra[swap2]
    arra[swap2] = temp

    this.saveCalculateNext(rot)
  }


  saveCalculateNext(rotation: Rotation){

    this.timeCalculation()
    this.bunkerCalculation()
    this.rotation$.next(rotation)
    this.appservice.addRotation(rotation)

  }

 

  timeCalculation() {

    let t = this.rotation

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

    let t = this.rotation
    const startFO = this.rotation.robFO!
    const startDO = this.rotation.robDO!

    const activityPerLoca = t.activityPerLocations!
    const bunker = this.bunker

    let robFORot: number = 0
    let robDORot: number = 0

    activityPerLoca.map((p, ix) => {

      let robFOAct: number = 0
      let robDOAct: number = 0



      let act = p.activities


      act?.map((a, i) => {

        if (i === 0) { 

          let b = this.bunkerCalculationPerActivity(a, bunker)

          a.robFO! = startFO - b.deltaFO
          a.robDO! = startDO - b.deltaDO

          robFOAct = startFO - b.deltaFO
          robDOAct = startDO - b.deltaDO

          i === p.activities?.length! - 1 ? (robFORot = robFOAct, robDORot = robDOAct) : null
        }
        else { 
          let b = this.bunkerCalculationPerActivity(a, bunker)

          a.robFO! = robFOAct - b.deltaFO
          a.robDO! = robDOAct - b.deltaDO

          robFOAct = robFOAct - b.deltaFO
          robDOAct = robDOAct - b.deltaDO

          i === p.activities?.length! - 1 ? (robFORot = robFOAct, robDORot = robDOAct) : null

        }

      })


    })
    // this.rotation$.next(t)
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
    activity.ddGG = ddgg.ddGG
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

      return { deltaFO: activity.restockFo!, deltaDO: activity.restockFo! }
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

  ddggCalculation(activity: Activity, bunker: BunkerOption): { ddGG: number, deltaFO: number, deltaDO: number } {

    let multiplier: number = 0

    const ddGGOne = activity.ddggOne
    const ddGGTwo = activity.ddggTwo
    const ddGGThree = activity.ddggThree
    const ddGGBunker = activity.ddGGBunker
    let deltaFO: number = 0
    let deltaDO: number = 0
    const ddGGBunkerCons = bunker.ddggDailyConsumption
    ddGGOne === 'on' ? multiplier += 1 : null
    ddGGTwo === 'on' ? multiplier += 1 : null
    ddGGThree === 'on' ? multiplier += 1 : null

    const deltaBunker: number = ((ddGGBunkerCons * multiplier) / 24) * activity.duration!

    if (ddGGBunker === 'fo') {
      return { ddGG: multiplier, deltaFO: deltaBunker, deltaDO: 0 }
    }
    if (ddGGBunker === 'do') {
      return { ddGG: multiplier, deltaFO: 0, deltaDO: deltaBunker }
    }

    return { ddGG: 0, deltaFO: 0, deltaDO: 0 }
  }

  boilerCalculation(activity: Activity, bunker: BunkerOption): { deltaFO: number, deltaDO: number, boilersNumberFO: number , boilersNumberDO: number} {

    const boilerMax = bunker.boilerMaxConsumption

    let boilerFO: number = 0
    let boilerDO: number = 0
    let boilerNFO: number = 0
    let boilerNDO: number = 0

    switch (activity.boilerOneFuel) {
      case 'off': boilerFO += 0; boilerDO += 0;
        break
      case 'fo':
        const consFO = (((boilerMax / 100) * activity.boilerOnePercentage!) / 24) * activity.duration!
        boilerFO += consFO; boilerDO += 0; boilerNFO += 1
        break
      case 'do':
        const consDO = (((boilerMax / 100) * activity.boilerOnePercentage!) / 24) * activity.duration!
        boilerFO += 0; boilerDO += consDO; boilerNDO += 1
    }

    switch (activity.boilerTwoFuel) {
      case 'off': boilerFO += 0; boilerDO += 0;
        break
      case 'fo':
        const consFO = (((boilerMax / 100) * activity.boilerTwoPercentage!) / 24) * activity.duration!
        boilerFO += consFO; boilerDO += 0; boilerNFO += 1
        break
      case 'do':
        const consDO = (((boilerMax / 100) * activity.boilerTwoPercentage!) / 24) * activity.duration!
        boilerFO += 0; boilerDO += consDO; boilerNDO += 1
    }

    switch (activity.boilerThreeFuel) {
      case 'off': boilerFO += 0; boilerDO += 0;
        break
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

}
