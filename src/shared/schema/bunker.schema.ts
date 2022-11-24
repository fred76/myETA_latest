
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
 
@Entity()
export class BunkerOption {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    speedCruise : number
    @Column()
    ballastCruise : number
    @Column()
    laddenCruise : number
    @Column()
    speed80 : number
    @Column()
    ballast80 : number
    @Column()
    ladden80 : number
    @Column()
    speed60 : number
    @Column()
    ballast60 : number
    @Column()
    ladden60 : number
    @Column()
    speed40 : number
    @Column()
    ballast40 : number
    @Column()
    ladden40 : number
    @Column()
    ddggDailyConsumption : number
    @Column()
    boilerMinConsumption : number
    @Column()
    boilerMaxConsumption : number
    @Column()
    foMaxStorage : number
    @Column()
    doMaxStorage : number

}