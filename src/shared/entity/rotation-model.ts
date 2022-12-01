import { Berth, PltStation, Port } from "../schema/location.schema";


export interface RotationModel {
    // id?: number
    dateTime?: Date
    utc?: number
    robFO?: number
    robDO?: number
    activityPerLocations?: ActivityPerLocationModel[]
}

export interface ActivityPerLocationModel {
    // id?: number
    port?: string
    pltStation?: string
    berth?: string
    utcTime?: number
    activities?: ActivityModel[]
}


export interface ActivityModel { 
    date?: string
    ECA?:  'true' | 'false',
    EoSP?:  'true' | 'false',
    ETX?: 'ETA' | 'ETB' | 'ETC' | 'ETS' | 'SoSP'
    speed?: number
    distance?: number
    duration?: number
    mainEngineFuel?: 'off' | 'fo' | 'do'
    ddggOne?: 'on' | 'off'
    ddggTwo?: 'on' | 'off'
    ddggThree?: 'on' | 'off'
    ddGGBunker?: 'fo' | 'do'
    boilerOneFuel?: 'off' | 'fo' | 'do'
    boilerTwoFuel?: 'off' | 'fo' | 'do'
    boilerThreeFuel?: 'off' | 'fo' | 'do'
    boilerOnePercentage?: number
    boilerTwoPercentage?: number
    boilerThreePercentage?: number
    restockFo?: number
    restockDo?: number
    cargoOnBoardMT?: number
    laddenPercentage?: number
    foExtimatecConsumption?: number
    doExtimatecConsumption?: number
    berthOfActivity?: string 
    activityType?:
    'Sea Passage'
    | 'Pilotage Inbound'
    | 'Pilotage Outbound'
    | 'Loading'
    | 'Discharging'
    | 'Tank Cleaning'
    | 'Shifting'
    | 'Layby Berth'
    | 'Bunkering'
    | 'Anchoring'
    | 'Drifting'
    | 'Canal Transit'

    calculatedETX?: string

    deltaFO?: number
    deltaDO?: number

    robFO?: number
    robDO?: number

    mainEngine?: number 
    ddGG?: number
    ddGGFODO?: string
    boilerFO?: number
    boilerDO?: number
}
