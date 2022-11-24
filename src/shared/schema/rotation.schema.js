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
exports.ChatRoomMessageEntity = exports.UserEntity = exports.ChatRoomEntity = exports.Activity = exports.ActivityPerLocation = exports.Rotation = void 0;
const typeorm_1 = require("typeorm");
let Rotation = class Rotation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Rotation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Rotation.prototype, "dateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Rotation.prototype, "utc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Rotation.prototype, "robFO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Rotation.prototype, "robDO", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ActivityPerLocation, (activityPerLocations) => activityPerLocations.rotation, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Rotation.prototype, "activityPerLocations", void 0);
Rotation = __decorate([
    (0, typeorm_1.Entity)()
], Rotation);
exports.Rotation = Rotation;
let ActivityPerLocation = class ActivityPerLocation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ActivityPerLocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityPerLocation.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityPerLocation.prototype, "pltStation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityPerLocation.prototype, "berth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ActivityPerLocation.prototype, "utcTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Rotation, (rotation) => rotation.activityPerLocations, { onDelete: "CASCADE", orphanedRowAction: 'delete' }),
    __metadata("design:type", Rotation)
], ActivityPerLocation.prototype, "rotation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Activity, (activity) => activity.activityPerLocation, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], ActivityPerLocation.prototype, "activities", void 0);
ActivityPerLocation = __decorate([
    (0, typeorm_1.Entity)()
], ActivityPerLocation);
exports.ActivityPerLocation = ActivityPerLocation;
let Activity = class Activity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Activity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "ETX", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "speed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "mainEngineFuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "ddggOne", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "ddggTwo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "ddggThree", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "ddGGBunker", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "boilerOneFuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "boilerTwoFuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "boilerThreeFuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "boilerOnePercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "boilerTwoPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "boilerThreePercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "restockFo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "restockDo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "cargoOnBoardMT", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "laddenPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "foExtimatecConsumption", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "doExtimatecConsumption", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "berthOfActivity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "activityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "calculatedETX", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "deltaFO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "deltaDO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "robFO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "robDO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "mainEngine", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "ddGG", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "ddGGFODO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "boilerFO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Activity.prototype, "boilerDO", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ActivityPerLocation, (activityPerLocation) => activityPerLocation.activities, { onDelete: "CASCADE", orphanedRowAction: 'delete' }),
    __metadata("design:type", ActivityPerLocation)
], Activity.prototype, "activityPerLocation", void 0);
Activity = __decorate([
    (0, typeorm_1.Entity)()
], Activity);
exports.Activity = Activity;
let ChatRoomEntity = class ChatRoomEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChatRoomEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], ChatRoomEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => ChatRoomMessageEntity, chatrmsg => chatrmsg.chatRoom),
    __metadata("design:type", Array)
], ChatRoomEntity.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => UserEntity, user => user.activeChatRooms),
    __metadata("design:type", Array)
], ChatRoomEntity.prototype, "activeUsers", void 0);
ChatRoomEntity = __decorate([
    (0, typeorm_1.Entity)()
], ChatRoomEntity);
exports.ChatRoomEntity = ChatRoomEntity;
let UserEntity = class UserEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "registrationDate", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => ChatRoomEntity, room => room.activeUsers, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], UserEntity.prototype, "activeChatRooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => ChatRoomMessageEntity, msg => msg.fromUser),
    __metadata("design:type", Array)
], UserEntity.prototype, "chatRoomMessages", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)()
], UserEntity);
exports.UserEntity = UserEntity;
let ChatRoomMessageEntity = class ChatRoomMessageEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChatRoomMessageEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], ChatRoomMessageEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatRoomMessageEntity.prototype, "creationDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => UserEntity, user => user.chatRoomMessages),
    __metadata("design:type", UserEntity)
], ChatRoomMessageEntity.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => ChatRoomEntity, chatRoom => chatRoom.messages),
    __metadata("design:type", ChatRoomEntity)
], ChatRoomMessageEntity.prototype, "chatRoom", void 0);
ChatRoomMessageEntity = __decorate([
    (0, typeorm_1.Entity)()
], ChatRoomMessageEntity);
exports.ChatRoomMessageEntity = ChatRoomMessageEntity;
// relations: ['activeUsers', 'messages', 'messages.fromUser'],
//# sourceMappingURL=rotation.schema.js.map