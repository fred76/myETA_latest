"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const typeorm_1 = require("typeorm");
const location_schema_1 = require("../src/shared/schema/location.schema");
const bunker_schema_1 = require("../src/shared/schema/bunker.schema");
const rotation_schema_1 = require("../src/shared/schema/rotation.schema");
// import { electron } from 'process';
const path = require("path");
let win;
const args = process.argv.slice(1), serve = args.some(val => val === '--serve');
function createWindow() {
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    const userDataPath = electron_1.app.getPath('userData');
    const connection = new typeorm_1.DataSource({
        type: 'sqlite',
        synchronize: true,
        logging: true,
        logger: 'simple-console',
        database: path.join(userDataPath) + '/db.sqlite',
        //database: './src/shared/db.sqlite',
        entities: [location_schema_1.Country, location_schema_1.Port, location_schema_1.PltStation, location_schema_1.Berth, bunker_schema_1.BunkerOption, rotation_schema_1.Rotation, rotation_schema_1.ActivityPerLocation, rotation_schema_1.Activity],
    });
    console.log('userDataPath');
    console.log(userDataPath);
    console.log('userDataPath');
    connection.initialize()
        .then(() => {
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
    const countryRepo = connection.getRepository(location_schema_1.Country);
    const portRepo = connection.getRepository(location_schema_1.Port);
    const pltStationRepo = connection.getRepository(location_schema_1.PltStation);
    const berthRepo = connection.getRepository(location_schema_1.Berth);
    const bunkerRepo = connection.getRepository(bunker_schema_1.BunkerOption);
    const rotationrRepo = connection.getRepository(rotation_schema_1.Rotation);
    const activityPerLocationRepo = connection.getRepository(rotation_schema_1.ActivityPerLocation);
    const activityRepo = connection.getRepository(rotation_schema_1.Activity);
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve),
            contextIsolation: false,
        },
    });
    //
    if (serve) {
        console.log('qwerty n n m m m m m m m m m m m m m m m m m m m m');
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        win.loadURL('http://localhost:4200');
        win.show();
        win.webContents.openDevTools();
    }
    else {
        console.log('zxcvbn  nnn n n n n n n n n n n');
        win.loadFile('dist/eta-angular/index.html');
    }
    win.on('closed', () => {
        win.destroy();
    });
    electron_1.ipcMain.handle('get-rotation', (rotation, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            rotation = yield rotationrRepo.findOne({
                where: {
                    id: 1
                },
                relations: [
                    'activityPerLocations', 'activityPerLocations.activities'
                ],
            });
            return rotation;
        }
        catch (err) {
            throw ('get-Rotation error: ' + err);
        }
    }));
    electron_1.ipcMain.handle('add-rotation', (event, rotation) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newRotation = yield rotationrRepo.create(rotation);
            yield rotationrRepo.save(newRotation);
            return newRotation;
        }
        catch (err) {
            throw err;
        }
    }));
    electron_1.ipcMain.handle('add-country', (event, country) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newCountry = yield countryRepo.create(country);
            yield countryRepo.save(newCountry);
            return newCountry;
        }
        catch (err) {
            throw err;
        }
    }));
    electron_1.ipcMain.handle('add-pltStation', (event, pltStation, country) => __awaiter(this, void 0, void 0, function* () {
        try {
            let c = yield countryRepo.findOne({
                where: {
                    id: country.id
                },
                relations: {
                    pltStations: true,
                },
            });
            if (c.pltStations === null || undefined) {
                c.pltStations = new Array;
            }
            c.pltStations.push(pltStation);
            yield countryRepo.save(c);
            return pltStation;
        }
        catch (err) {
            throw err;
        }
    }));
    electron_1.ipcMain.handle('add-port', (event, port, pltStation) => __awaiter(this, void 0, void 0, function* () {
        try {
            let c = yield pltStationRepo.findOne({
                where: {
                    id: pltStation.id
                },
                relations: {
                    ports: true,
                },
            });
            if (c.ports === null || undefined) {
                c.ports = new Array;
            }
            c.ports.push(port);
            yield pltStationRepo.save(c);
            return port;
        }
        catch (err) {
            throw err;
        }
    }));
    electron_1.ipcMain.handle('add-berh', (event, berth, port) => __awaiter(this, void 0, void 0, function* () {
        try {
            let c = yield portRepo.findOne({
                where: {
                    id: port.id
                },
                relations: {
                    berths: true,
                },
            });
            if (c.berths === null || undefined) {
                c.berths = new Array;
            }
            c.berths.push(berth);
            yield portRepo.save(c);
            return berth;
        }
        catch (err) {
            throw err;
        }
    }));
    electron_1.ipcMain.handle('get-country', (country, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            country = yield countryRepo.find();
            return country;
        }
        catch (err) {
            throw ('get-country error: ' + err);
        }
    }));
    electron_1.ipcMain.handle('get-pltStation-All', (pltStation, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            pltStation = yield pltStationRepo.find();
            return pltStation;
        }
        catch (err) {
            throw ('get-Port error: ' + err);
        }
    }));
    electron_1.ipcMain.handle('get-pltStation', (event, country, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            country = yield countryRepo.findOne({
                where: {
                    id: country.id
                },
                relations: {
                    pltStations: true
                }
            });
            return country.pltStations;
        }
        catch (err) {
            throw ('get-country error: ' + err);
        }
    }));
    electron_1.ipcMain.handle('get-port', (event, pltStation, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            pltStation = yield pltStationRepo.findOne({
                where: {
                    id: pltStation.id
                },
                relations: {
                    ports: true
                }
            });
            return pltStation.ports;
        }
        catch (err) {
            throw ('get-country error: ' + err);
        }
    }));
    electron_1.ipcMain.handle('get-berth', (event, port, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            port = yield portRepo.findOne({
                where: {
                    id: port.id
                },
                relations: {
                    berths: true
                }
            });
            return port.berths;
        }
        catch (err) {
            throw ('get-country error: ' + err);
        }
    }));
    electron_1.ipcMain.handle('delete-country', (event, country) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield countryRepo
                .createQueryBuilder()
                .delete()
                .from(location_schema_1.Country)
                .where("id = :id", { id: country.id })
                .execute();
            return countryRepo.find();
        }
        catch (err) {
            throw ('error port ' + err);
        }
    }));
    electron_1.ipcMain.handle('delete-port', (event, port) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield portRepo
                .createQueryBuilder()
                .delete()
                .from(location_schema_1.Port)
                .where("id = :id", { id: port.id })
                .execute();
            return portRepo.find();
        }
        catch (err) {
            throw ('error port ' + err);
        }
    }));
    electron_1.ipcMain.handle('delete-pltStation', (event, pltStation) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield pltStationRepo
                .createQueryBuilder()
                .delete()
                .from(location_schema_1.PltStation)
                .where("id = :id", { id: pltStation.id })
                .execute();
            return pltStationRepo.find();
        }
        catch (err) {
            throw ('error pltStation ' + err);
        }
    }));
    electron_1.ipcMain.handle('delete-berth', (event, berth) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield berthRepo
                .createQueryBuilder()
                .delete()
                .from(location_schema_1.Berth)
                .where("id = :id", { id: berth.id })
                .execute();
            return berthRepo.find();
        }
        catch (err) {
            throw ('error bert ' + err);
        }
    }));
    electron_1.ipcMain.handle('add-bunker', (event, bunkerOption) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield bunkerRepo.clear();
            const newBunker = yield bunkerRepo.create(bunkerOption);
            yield bunkerRepo.save(newBunker);
            return newBunker;
        }
        catch (err) {
            throw err;
        }
    }));
    electron_1.ipcMain.handle('get-bunker', (bunkeOpt, ...args) => __awaiter(this, void 0, void 0, function* () {
        try {
            bunkeOpt = yield bunkerRepo.find();
            return bunkeOpt[0];
        }
        catch (err) {
            throw ('get-bunker error: ' + err);
        }
    }));
    return win;
}
try {
    electron_1.app.on('ready', () => setTimeout(createWindow, 400));
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
}
//# sourceMappingURL=electron-main.js.map