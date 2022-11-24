
import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, ManyToMany, JoinTable
} from 'typeorm';

@Entity()
export class Rotation {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    dateTime: Date
    @Column({nullable: true})
    utc: number
    @Column({nullable: true})
    robFO: number
    @Column({nullable: true})
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

    @Column({nullable: true})
    port: string
    @Column({nullable: true})
    pltStation: string
    @Column({nullable: true})
    berth: string
    @Column({nullable: true})
    utcTime: number

    @ManyToOne(() => Rotation, (rotation) => rotation.activityPerLocations, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    rotation: Rotation

    @OneToMany(() => Activity, (activity) => activity.activityPerLocation, {
        cascade: true,
        onDelete: "CASCADE"
    })

    activities: Activity[]
}
 
@Entity()
export class Activity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    date: string
    @Column({nullable: true})
    ETX: 'ETA' | 'ETB' | 'ETC' | 'ETS' | 'SoSP'
    @Column({nullable: true})
    speed: number
    @Column({nullable: true})
    distance: number
    @Column({nullable: true})
    duration: number
    @Column({nullable: true})
    mainEngineFuel: 'off' | 'fo' | 'do'
    @Column({nullable: true})
    ddggOne: 'on' | 'off'
    @Column({nullable: true})
    ddggTwo: 'on' | 'off'
    @Column({nullable: true})
    ddggThree: 'on' | 'off'
    @Column({nullable: true})
    ddGGBunker: 'fo' | 'do'
    @Column({nullable: true})
    boilerOneFuel: 'off' | 'fo' | 'do'
    @Column({nullable: true})
    boilerTwoFuel: 'off' | 'fo' | 'do'
    @Column({nullable: true})
    boilerThreeFuel: 'off' | 'fo' | 'do'
    @Column({nullable: true})
    boilerOnePercentage: number
    @Column({nullable: true})
    boilerTwoPercentage: number
    @Column({nullable: true})
    boilerThreePercentage: number
    @Column({nullable: true})
    restockFo: number
    @Column({nullable: true})
    restockDo: number
    @Column({nullable: true})
    cargoOnBoardMT: number
    @Column({nullable: true})
    laddenPercentage: number
    @Column({nullable: true})
    foExtimatecConsumption: number
    @Column({nullable: true})
    doExtimatecConsumption: number
    @Column({nullable: true})
    berthOfActivity: string 
    @Column({nullable: true})
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

    @Column({nullable: true})
    calculatedETX: string

    @Column({nullable: true}) 
    deltaFO: number
    @Column({nullable: true})
    deltaDO: number

    @Column({nullable: true})
    robFO: number
    @Column({nullable: true})
    robDO: number

    @Column({nullable: true})
    mainEngine: number 
    @Column({nullable: true})
    ddGG: number
    @Column({nullable: true})
    ddGGFODO: string
    @Column({nullable: true})
    boilerFO: number
    @Column({nullable: true})
    boilerDO: number

    @ManyToOne(() => ActivityPerLocation, (activityPerLocation) => activityPerLocation.activities, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    activityPerLocation: ActivityPerLocation

}
 

@Entity()
export class ChatRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {nullable: true})
  title: string;

  @OneToMany(type => ChatRoomMessageEntity, chatrmsg => chatrmsg.chatRoom)
  messages: ChatRoomMessageEntity[];

  @ManyToMany(type => UserEntity, user => user.activeChatRooms)
  activeUsers: UserEntity[];

}


@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  registrationDate: Date;

  @ManyToMany(type => ChatRoomEntity, room => room.activeUsers, {cascade: true})
  @JoinTable()
  activeChatRooms: ChatRoomEntity[];

  @OneToMany(type => ChatRoomMessageEntity, msg => msg.fromUser)
  chatRoomMessages: ChatRoomMessageEntity[];
}


@Entity()
export class ChatRoomMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {nullable: true})
  message: string;

  @CreateDateColumn()
  creationDate: Date;

  @ManyToOne(type => UserEntity, user => user.chatRoomMessages)
  fromUser: UserEntity;

  @ManyToOne(type => ChatRoomEntity, chatRoom => chatRoom.messages)
  chatRoom: ChatRoomEntity;

}


// relations: ['activeUsers', 'messages', 'messages.fromUser'],

