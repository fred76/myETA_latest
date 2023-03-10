import { Injectable } from '@angular/core';
import { ipcMain } from 'electron';


import { ElectronService } from 'ngx-electronify/node_modules/ngx-electronyzer';
import { Observable, of } from 'rxjs';
import { BunkerOption } from 'src/shared/schema/bunker.schema';
import { Agency, Berth, BerthNotes, Country, CountryNotes, PltStation, Port, PortNotes } from 'src/shared/schema/location.schema';
import { Activity, Rotation } from 'src/shared/schema/rotation.schema';



@Injectable({
  providedIn: 'root'
})
export class MyElectronService {

  constructor(private _electronService: ElectronService) { }
 

  getAgencByPortName(portName: string): Promise<Agency[]> {
    return this._electronService.ipcRenderer.invoke('get-agency-by-port-name', portName)
  }

  // COUNTRY & PORTS


  addCountryPorts(country: Country[]): Promise<Country> {
    return this._electronService.ipcRenderer.invoke('add-country-ports', country)
  }

  // ROTATION

  getRotation(): Promise<Rotation> {  
    return this._electronService.ipcRenderer.invoke('get-rotation')
  }
  addRotation(rotation: Rotation): Promise<Rotation> {
  
    return this._electronService.ipcRenderer.invoke('add-rotation', rotation)
  }

  getBerthByPort(portName: string): Promise<string[]> {
    return this._electronService.ipcRenderer.invoke('get-berth-by-port', portName)
  }

  getBerthByActivityID(activity: Activity): Promise<string[]> {
    return this._electronService.ipcRenderer.invoke('get-berth-by-activityID', activity)
  }

  getPltStationAll(): Promise<PltStation[]> {
    return this._electronService.ipcRenderer.invoke('get-pltStation-All')
  }

  // NOTES COUNTRY

  getCountryNotes(country: Country): Promise<CountryNotes[]> {
    return this._electronService.ipcRenderer.invoke('get-country-notes', country)
  }

  addCountryNotes(countryNote: CountryNotes, country: Country): Promise<CountryNotes[]> {
    return this._electronService.ipcRenderer.invoke('add-country-notes', countryNote, country)
  }

  editCountryNotes(countryNote: CountryNotes): Promise<CountryNotes[]> {
    return this._electronService.ipcRenderer.invoke('edit-country-notes', countryNote)
  }

  deleteCountryNotes(countryNote: CountryNotes): Promise<CountryNotes[]> {
    return this._electronService.ipcRenderer.invoke('delete-country-notes', countryNote)
  }

  // NOTES PORT

  getPortNotes(port: Port): Promise<PortNotes[]> {
    return this._electronService.ipcRenderer.invoke('get-port-notes', port)
  }

  addPortNotes(portNote: PortNotes, port: Port): Promise<PortNotes[]> {
    return this._electronService.ipcRenderer.invoke('add-port-notes', portNote, port)
  }

  deletePortNotes(portNote: PortNotes): Promise<PortNotes[]> {
    return this._electronService.ipcRenderer.invoke('delete-port-notes', portNote)
  }

  editPortNotes(portNote: PortNotes): Promise<PortNotes[]> {
    return this._electronService.ipcRenderer.invoke('edit-port-notes', portNote)
  }

  // NOTES BERTH

  getBerthNotes(berth: Berth): Promise<BerthNotes[]> {
    return this._electronService.ipcRenderer.invoke('get-berth-notes', berth)
  }

  addBerthNotes(berthNote: BerthNotes, berth: Berth): Promise<BerthNotes[]> {
    return this._electronService.ipcRenderer.invoke('add-berth-notes', berthNote, berth)
  }

  editBerthNotes(berthNote: BerthNotes): Promise<BerthNotes[]> {
    return this._electronService.ipcRenderer.invoke('edit-berth-notes', berthNote)
  }

  deleteBerthNotes(berthNote: BerthNotes): Promise<BerthNotes[]> {
    return this._electronService.ipcRenderer.invoke('delete-berth-notes', berthNote)
  }

  // PORT AGENCIES

  getAgencyByID(agencyID: number): Promise<Agency> {
    return this._electronService.ipcRenderer.invoke('get-agent-by-id', agencyID)
  }

  getAgency(port: Port): Promise<Agency[]> {
    return this._electronService.ipcRenderer.invoke('get-port-agent', port)
  }

  addAgency(agency: Agency, port: Port): Promise<Agency[]> {
    return this._electronService.ipcRenderer.invoke('add-port-agent', agency, port)
  }

  deleteAgency(agency: Agency): Promise<Agency[]> {
    return this._electronService.ipcRenderer.invoke('delete-port-agent', agency)
  }

  editAgency(agency: Agency): Promise<Agency[]> {
    return this._electronService.ipcRenderer.invoke('edit-port-agent', agency)
  }

  editPortAgentFromActivity(agency: Agency): Promise<Agency> {
    return this._electronService.ipcRenderer.invoke('edit-port-agent-fromActivity', agency)
  }

  // LOCATION COUNTRY

  // addCountry(country: Country): Promise<Country> {
  //   return this._electronService.ipcRenderer.invoke('add-country', country)
  // }

  getCountry(): Promise<Country[]> {
    return this._electronService.ipcRenderer.invoke('get-country')
  }

  // deleteCountry(country: Country): Promise<Country[]> {
  //   return this._electronService.ipcRenderer.invoke('delete-country', country)
  // }

  // LOCATION PORT

  addPort(port: Port, country: Country): Promise<Port> {
    return this._electronService.ipcRenderer.invoke('add-port', port, country)
  }

  getPort(country: Country): Promise<Port[]> {
    return this._electronService.ipcRenderer.invoke('get-port', country)
  }

  // deletePort(port: Port): Promise<Port[]> {
  //   return this._electronService.ipcRenderer.invoke('delete-port', port)
  // }

  // LOCATION PLTSTATION

  addPltStation(pltStation: PltStation, port: Port): Promise<PltStation> {
    return this._electronService.ipcRenderer.invoke('add-pltStation', pltStation, port)
  }

  getPltStation(port: Port): Promise<PltStation[]> {
    return this._electronService.ipcRenderer.invoke('get-pltStation', port)
  }

  // deletePltStation(pltStation: PltStation): Promise<PltStation[]> {
  //   return this._electronService.ipcRenderer.invoke('delete-pltStation', pltStation)
  // }

  // LOCATION BERTH

  addBerth(berth: Berth, port: Port): Promise<Berth> {
    return this._electronService.ipcRenderer.invoke('add-berh', berth, port)
  }

  getBerth(port: Port): Promise<Berth[]> {
    return this._electronService.ipcRenderer.invoke('get-berth', port)
  }

  // deleteBerth(berth: Berth): Promise<Berth[]> {
  //   return this._electronService.ipcRenderer.invoke('delete-berth', berth)
  // }

  // BUNKER

  exportRotation(rotation: Rotation) {
    this._electronService.ipcRenderer.send('export-rotation', rotation)
  }
  importRotation() {
    this._electronService.ipcRenderer.send('import-rotation')
    return new Observable<any>(observer => {
      this._electronService.ipcRenderer.on('send-imported-rotation', (event, arg) => { 
        observer.next(arg);
      })  
    });

   
  }

  addBunker(bunker: BunkerOption): Promise<BunkerOption> {
    return this._electronService.ipcRenderer.invoke('add-bunker', bunker)
  }
  
  getBunker(): Promise<BunkerOption> {
    return this._electronService.ipcRenderer.invoke('get-bunker')
  }




}
