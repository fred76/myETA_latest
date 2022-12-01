import { Injectable } from '@angular/core';


import { ElectronService } from 'ngx-electronify/node_modules/ngx-electronyzer'; 
import { BunkerOption } from 'src/shared/schema/bunker.schema';
import { Berth, Country, PltStation, Port } from 'src/shared/schema/location.schema';
import { Activity, Rotation } from 'src/shared/schema/rotation.schema';



@Injectable({
  providedIn: 'root'
})
export class MyElectronService {

  constructor(private _electronService: ElectronService) { }

  
  addRotation(rotation: Rotation): Promise<Rotation> {
    return this._electronService.ipcRenderer.invoke('add-rotation', rotation)
  }

  getRotation(): Promise<Rotation> {
    return this._electronService.ipcRenderer.invoke('get-rotation') 
  }

  addCountry(country: Country): Promise<Country> {
    return this._electronService.ipcRenderer.invoke('add-country', country)
  }
  addPltStation(pltStation: PltStation, country: Country): Promise<PltStation> {
    return this._electronService.ipcRenderer.invoke('add-pltStation', pltStation, country)
  }

  addPort(port: Port, pltStation: PltStation): Promise<Port> {
    return this._electronService.ipcRenderer.invoke('add-port', port, pltStation)
  }

  addBerth(berth: Berth, port: Port): Promise<Berth> {
    return this._electronService.ipcRenderer.invoke('add-berh', berth, port)
  }

 
 
  getCountry(): Promise<Country[]> {
    return this._electronService.ipcRenderer.invoke('get-country') 
  }
  
 getPltStationAll(): Promise<PltStation[]> {
    return this._electronService.ipcRenderer.invoke('get-pltStation-All') 
  }

  getPltStation(country: Country): Promise<PltStation[]> {
    return this._electronService.ipcRenderer.invoke('get-pltStation', country) 
  }


  getPort(pltStation: PltStation): Promise<Port[]> {
    return this._electronService.ipcRenderer.invoke('get-port', pltStation) 
  }
 

  getBerth(port: Port): Promise<Berth[]> {
    return this._electronService.ipcRenderer.invoke('get-berth', port) 
  }

  getBerthByPort(portName: string): Promise<string[]> {
    return this._electronService.ipcRenderer.invoke('get-berth-by-port', portName) 
  }
  getBerthByActivityID(activity: Activity): Promise<string[]> {
    return this._electronService.ipcRenderer.invoke('get-berth-by-activityID', activity) 
  }
 
  deleteCountry(country: Country): Promise<Country[]> {
    return this._electronService.ipcRenderer.invoke('delete-country',country) 
  }

  deletePort(port: Port): Promise<Port[]> {
    return this._electronService.ipcRenderer.invoke('delete-port', port) 
  }

  deletePltStation(pltStation: PltStation): Promise<PltStation[]> {
    return this._electronService.ipcRenderer.invoke('delete-pltStation', pltStation) 
  }

  deleteBerth(berth: Berth): Promise<Berth[]> {
    return this._electronService.ipcRenderer.invoke('delete-berth', berth) 
  }
 


  addBunker(bunker: BunkerOption): Promise<BunkerOption> {
    return this._electronService.ipcRenderer.invoke('add-bunker', bunker)
  }


  getBunker(): Promise<BunkerOption> {
    return this._electronService.ipcRenderer.invoke('get-bunker') 
  }

  
 

}
