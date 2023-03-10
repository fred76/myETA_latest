
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Relation
} from 'typeorm';
import { Agency } from './location.schema';

@Entity()
export class Rotation {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  dateTime: Date
  @Column({ nullable: true })
  utc: number
  @Column({ nullable: true })
  robFO: number
  @Column({ nullable: true })
  robDO: number

  @OneToMany(() => ActivityPerLocation, (activityPerLocations) => activityPerLocations.rotation, {
    cascade: true,
    onDelete: "CASCADE"
  })
  activityPerLocations: ActivityPerLocation[]
}

@Entity()
export class ActivityPerLocation {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  port: string
  @Column({ nullable: true })
  pltStation: string
  @Column({ nullable: true })
  berth: string
  @Column({ nullable: true })
  utcTime: number
  @Column({ nullable: true })
  idOrder: number


  @ManyToOne(() => Rotation, (rotation) => rotation.activityPerLocations, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
  rotation: Rotation

  @OneToMany(() => Activity, (activity) => activity.activityPerLocation, {
    cascade: true,
    onDelete: "CASCADE"
  })

  activities: Activity[]

  // AGGIUNTO


}

@Entity()
export class Activity {

  @PrimaryGeneratedColumn()
  id: number
  @Column({ nullable: true })
  date: string
  @Column({ nullable: true })
  ETX: 'ETA' | 'ETB' | 'ETC' | 'ETS' | 'SoSP'
  @Column({ nullable: true })
  speed: number
  @Column({ nullable: true })
  distance: number
  @Column({ nullable: true })
  duration: number
  @Column({ nullable: true })
  mainEngineFuel: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  ddggOne: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  ddggTwo: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  ddggThree: 'off' | 'fo' | 'do'
  // @Column({ nullable: true })
  // ddGGBunker: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  boilerOneFuel: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  boilerTwoFuel: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  boilerThreeFuel: 'off' | 'fo' | 'do'
  @Column({ nullable: true })
  boilerOnePercentage: number
  @Column({ nullable: true })
  boilerTwoPercentage: number
  @Column({ nullable: true })
  boilerThreePercentage: number
  @Column({ nullable: true })
  restockFo: number
  @Column({ nullable: true })
  restockDo: number
  @Column({ nullable: true })
  cargoOnBoardMT: number
  @Column({ nullable: true })
  laddenPercentage: number
  @Column({ nullable: true })
  foExtimatecConsumption: number
  @Column({ nullable: true })
  doExtimatecConsumption: number
  @Column({ nullable: true })
  berthOfActivity: string
  @Column({ nullable: true })
  activityType:
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

  @Column({ nullable: true })
  calculatedETX: string

  @Column({ nullable: true })
  deltaFO: number
  @Column({ nullable: true })
  deltaDO: number

  @Column({ nullable: true })
  robFO: number
  @Column({ nullable: true })
  robDO: number

  @Column({ nullable: true })
  mainEngine: number
  @Column({ nullable: true })
  ddGGFONumber: number
  @Column({ nullable: true })
  ddGGDONumber: number
  @Column({ nullable: true })
  ddGGFODO: string
  @Column({ nullable: true })
  boilerFO: number
  @Column({ nullable: true })
  boilerDO: number
  @Column({ nullable: true })
  ECA: 'isECA' | 'notECA'
  @Column({ nullable: true })
  EoSP: 'isEoSP' | 'notEoSP' 
  @Column({ nullable: true })
  idOrder: number

  @ManyToOne(() => ActivityPerLocation,
    (activityPerLocation) => activityPerLocation.activities,
    { onDelete: "CASCADE", orphanedRowAction: 'delete' })

  public activityPerLocation: ActivityPerLocation

  @ManyToOne(() => Agency, (agency) => agency.activities, { nullable: true, onDelete: "SET NULL" })
  public agency: Agency


}

