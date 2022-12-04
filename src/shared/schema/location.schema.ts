import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    countryName: string

    @OneToMany(() => PltStation, (pltStation) => pltStation.country, {
        cascade: true,
        onDelete: "CASCADE"
    })

    pltStations: PltStation[]

    @OneToMany(() => CountryNotes, (countryNote) => countryNote.country, {
        cascade: true,
        onDelete: "CASCADE"
    })
    notes: CountryNotes[]
}

//Country otom Port

@Entity()
export class PltStation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pltStationName: string

    @ManyToOne(() => Country, (country) => country.pltStations, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    country: Country

    @OneToMany(() => Port, (port) => port.pltStation, {
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

    @ManyToOne(() => PltStation, (pltStation) => pltStation.ports, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    pltStation: PltStation

    @OneToMany(() => Berth, (berth) => berth.pltStation, {
        cascade: true,
        onDelete: "CASCADE"
    })
    berths: Berth[]

    @OneToMany(() => PortNotes, (portNote) => portNote.port, {
        cascade: true,
        onDelete: "CASCADE"
    })
    notes: PortNotes[]


}

//PltStation mtom Port

@Entity()
export class Berth {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    berthName: string

    @ManyToOne(() => Port, (port) => port.berths, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    pltStation: PltStation

    @OneToMany(() => BerthNotes, (berthNote) => berthNote.berth, {
        cascade: true,
        onDelete: "CASCADE"
    })
    notes: BerthNotes[]

}


@Entity()
export class CountryNotes {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    countryTitle: string
    
    @Column()
    countryNote: string

    @ManyToOne(() => Country, (country) => country.notes, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    
    country: Country
}

@Entity()
export class PortNotes {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    portTitle: string
    
    @Column()
    portNote: string

    @ManyToOne(() => Port, (port) => port.notes, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    
    port: Port
}


@Entity()
export class BerthNotes {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    berthTitle: string
    
    @Column()
    berthNote: string

    @ManyToOne(() => Berth, (berth) => berth.notes, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    
    berth: Berth
}

@Entity()
export class Agency {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    agencyName: string

    @Column({ nullable: true })
    agencyPhone: string

    @Column({ nullable: true })
    agencyPhone1: string

    @Column({ nullable: true })
    agencyCell: string

    @Column({ nullable: true })
    agencyCell1: string

    @Column({ nullable: true })
    agencyEmail: string

    @Column({ nullable: true })
    agencyEmail1: string

    @Column({ nullable: true })
    agencyAddress: string

    @Column({ nullable: true })
    noteAgency: string;
}