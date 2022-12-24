import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Activity, ActivityPerLocation } from './rotation.schema';
@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    countryName: string

    @OneToMany(() => Port, (port) => port.country, {
        cascade: true,
        onDelete: "CASCADE"
    })

    public ports: Port[]

    @OneToMany(() => CountryNotes, (countryNote) => countryNote.country, {
        cascade: true,
        onDelete: "CASCADE"
    })
    notes: CountryNotes[]
}

//PltStation mtom Port

@Entity()
export class Port {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    portName: string

    @Column({ nullable: true })
    unlocs: string

    @ManyToOne(() => Country, (country) => country.ports, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    public country: Country

    @OneToMany(() => Berth, (berth) => berth.port, {
        cascade: true,
        onDelete: "CASCADE"
    })
    public berths: Berth[]

    @OneToMany(() => PltStation, (pltStation) => pltStation.port, {
        cascade: true,
        onDelete: "CASCADE"
    })
    public pltStations: PltStation[]

    @OneToMany(() => PortNotes, (portNote) => portNote.port, {
        cascade: true,
        onDelete: "CASCADE"
    })
    public notesPort: PortNotes[]

    @OneToMany(() => Agency, (agency) => agency.port, {
        cascade: true,
        onDelete: "CASCADE"
    })
    public agencies: Agency[]


}

//Country otom Port

//Country otom Port

@Entity()
export class PltStation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pltStationName: string

    @ManyToOne(() => Port, (port) => port.pltStations, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    port: Port

}



//PltStation mtom Port

@Entity()
export class Berth {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    berthName: string

    @ManyToOne(() => Port, (port) => port.berths, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    public port: Port

    @OneToMany(() => BerthNotes, (berthNote) => berthNote.berth, {
        cascade: true,
        onDelete: "CASCADE"
    })
    public  notesBerth: BerthNotes[]

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

    @ManyToOne(() => Port, (port) => port.notesPort, { onDelete: "CASCADE", orphanedRowAction: 'delete' })

    public  port: Port




}


@Entity()
export class BerthNotes {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    berthTitle: string

    @Column()
    berthNote: string

    @ManyToOne(() => Berth, (berth) => berth.notesBerth, { onDelete: "CASCADE", orphanedRowAction: 'delete' })

    public  berth: Berth

    
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
    agencyCell24Hrs: string

    @Column({ nullable: true })
    agencyGeneralEmail: string

    @Column({ nullable: true })
    agencyAddress: string

    @Column({ nullable: true })
    noteAgency: string;

    @ManyToOne(() => Port, (port) => port.agencies, { onDelete: "CASCADE", orphanedRowAction: 'delete' })

    public  port: Port

    @OneToMany(() => AgencyOperator, (operator) => operator.agency, {
        cascade: true,
        onDelete: "CASCADE"
    })
    public  operators: AgencyOperator[]

    // AGGIUNTO 
 
    @OneToMany(() => Activity, (activity) => activity.agency ,{ nullable: true,}, )
    public activities:  Activity[]
   
 
}

@Entity()
export class AgencyOperator {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    operatorName: string

    @Column({ nullable: true })
    operatorPhone: string

    @Column({ nullable: true })
    operatorCell: string

    @Column({ nullable: true })
    operatorEmail: string

    @ManyToOne(() => Agency, (agency) => agency.operators, { onDelete: "CASCADE", orphanedRowAction: 'delete' })

    public  agency: Agency
}

/*
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
    
    @Column()
    unlocs: string

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

    @OneToMany(() => Agency, (agency) => agency.port, {
        cascade: true,
        onDelete: "CASCADE"
    })
    agencies: Agency[]


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

    @OneToMany(() => BerthNotes, (berthNote) => berthNote.berth, {
        cascade: true,
        onDelete: "CASCADE"
    })
    notes: BerthNotes[]
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
    agencyCell24Hrs: string

    @Column({ nullable: true })
    agencyGeneralEmail: string
 
    @Column({ nullable: true })
    agencyAddress: string

    @Column({ nullable: true })
    noteAgency: string;

    @ManyToOne(() => Port, (port) => port.agencies, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    
    port: Port

    @OneToMany(() => AgencyOperator, (operator) => operator.agency, {
        cascade: true,
        onDelete: "CASCADE"
    })
    operators: AgencyOperator[]
}

@Entity()
export class AgencyOperator {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    operatorName: string

    @Column({ nullable: true })
    operatorPhone: string
  
    @Column({ nullable: true })
    operatorCell: string
  
    @Column({ nullable: true })
    operatorEmail: string
  
    @ManyToOne(() => Agency, (agency) => agency.operators, { onDelete: "CASCADE", orphanedRowAction: 'delete' })
    
    agency: Agency
}


*/