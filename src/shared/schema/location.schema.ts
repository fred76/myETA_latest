import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany  } from 'typeorm';
 
@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    countryName: string

    @OneToMany(() => PltStation, (pltStation) => pltStation.country,{
        cascade: true,
        onDelete: "CASCADE" 
    })
    pltStations: PltStation[] 
}

//Country otom Port

@Entity()
export class PltStation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pltStationName: string

    @ManyToOne(() => Country, (country) => country.pltStations, {onDelete: "CASCADE", orphanedRowAction: 'delete'}  )
    country: Country

    @OneToMany(() => Port, (port) => port.pltStation,{
        cascade: true,
        onDelete: "CASCADE" 
    })
    ports: Port[]

}

//PltStation mtom Port

@Entity()
export class Port {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    portName: string 

    @ManyToOne(() => PltStation, (pltStation) => pltStation.ports ,{onDelete: "CASCADE", orphanedRowAction: 'delete'}  )
    pltStation: PltStation

    @OneToMany(() => Berth, (berth) => berth.pltStation,{
        cascade: true,
        onDelete: "CASCADE" 
    })
    berths: Berth[]
   
 
}

//PltStation mtom Port
 
@Entity()
export class Berth {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    berthName: string

    @ManyToOne(() => Port, (port) => port.berths, {onDelete: "CASCADE", orphanedRowAction: 'delete'}  )
    pltStation: PltStation

}

/*
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany  } from 'typeorm';
 
@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    countryName: string

    @OneToMany(() => Port, (port) => port.country,{
        cascade: true,
        onDelete: "CASCADE" 
    })
    ports: Port[] 
}

//Country otom Port

@Entity()
export class Port {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    portName: string

    @ManyToOne(() => Country, (country) => country.ports, {onDelete: "CASCADE", orphanedRowAction: 'delete'}  )
    country: Country

    @OneToMany(() => PltStation, (pltStation) => pltStation.port,{
        cascade: true,
        onDelete: "CASCADE" 
    })
    pltStations: PltStation[]

}

//PltStation mtom Port

@Entity()
export class PltStation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pltStationName: string 

    @ManyToOne(() => Port, (port) => port.pltStations ,{onDelete: "CASCADE", orphanedRowAction: 'delete'}  )
    port: Port

    @OneToMany(() => Berth, (berth) => berth.pltStation,{
        cascade: true,
        onDelete: "CASCADE" 
    })
    berths: Berth[]
   
 
}

//PltStation mtom Port
 
@Entity()
export class Berth {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    berthName: string

    @ManyToOne(() => PltStation, (pltStation) => pltStation.berths, {onDelete: "CASCADE", orphanedRowAction: 'delete'}  )
    pltStation: PltStation

}
*/