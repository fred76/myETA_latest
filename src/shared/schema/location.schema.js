"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Berth = exports.Port = exports.PltStation = exports.Country = void 0;
const typeorm_1 = require("typeorm");
let Country = class Country {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Country.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Country.prototype, "countryName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PltStation, (pltStation) => pltStation.country, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Country.prototype, "pltStations", void 0);
Country = __decorate([
    (0, typeorm_1.Entity)()
], Country);
exports.Country = Country;
//Country otom Port
let PltStation = class PltStation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PltStation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PltStation.prototype, "pltStationName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Country, (country) => country.pltStations, { onDelete: "CASCADE", orphanedRowAction: 'delete' }),
    __metadata("design:type", Country)
], PltStation.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Port, (port) => port.pltStation, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], PltStation.prototype, "ports", void 0);
PltStation = __decorate([
    (0, typeorm_1.Entity)()
], PltStation);
exports.PltStation = PltStation;
//PltStation mtom Port
let Port = class Port {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Port.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Port.prototype, "portName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PltStation, (pltStation) => pltStation.ports, { onDelete: "CASCADE", orphanedRowAction: 'delete' }),
    __metadata("design:type", PltStation)
], Port.prototype, "pltStation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Berth, (berth) => berth.pltStation, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Port.prototype, "berths", void 0);
Port = __decorate([
    (0, typeorm_1.Entity)()
], Port);
exports.Port = Port;
//PltStation mtom Port
let Berth = class Berth {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Berth.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Berth.prototype, "berthName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Port, (port) => port.berths, { onDelete: "CASCADE", orphanedRowAction: 'delete' }),
    __metadata("design:type", PltStation)
], Berth.prototype, "pltStation", void 0);
Berth = __decorate([
    (0, typeorm_1.Entity)()
], Berth);
exports.Berth = Berth;
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
//# sourceMappingURL=location.schema.js.map