import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { DataSource } from 'typeorm';
import { Berth, Country, PltStation, Port } from '../src/shared/schema/location.schema';
import { BunkerOption } from '../src/shared/schema/bunker.schema';
import { Activity, ActivityPerLocation, Rotation } from '../src/shared/schema/rotation.schema';
// import { electron } from 'process';
import path = require('path');
import * as url from 'url';

let win: BrowserWindow
const args = process.argv.slice(1),
	serve = args.some(val => val === '--serve');



function createWindow(): BrowserWindow {

	const size = screen.getPrimaryDisplay().workAreaSize;
	const userDataPath = app.getPath('userData')


	const connection = new DataSource({
		type: 'sqlite',
		synchronize: true,
		logging: true,
		logger: 'simple-console',
		database: path.join(userDataPath) + '/db.sqlite',
		//database: './src/shared/db.sqlite',
		entities: [Country, Port, PltStation, Berth, BunkerOption, Rotation, ActivityPerLocation, Activity],
	});


	connection.initialize()
		.then(() => {
		})
		.catch((err) => {
			console.error("Error during Data Source initialization", err)
		})

	const countryRepo = connection.getRepository(Country);
	const portRepo = connection.getRepository(Port);
	const pltStationRepo = connection.getRepository(PltStation);
	const berthRepo = connection.getRepository(Berth);
	const bunkerRepo = connection.getRepository(BunkerOption);
	const rotationrRepo = connection.getRepository(Rotation);
	const activityPerLocationRepo = connection.getRepository(ActivityPerLocation);
	const activityRepo = connection.getRepository(Activity);


	win = new BrowserWindow({
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
		win.loadFile('dist/eta-angular/index.html');
		win.show();
		win.webContents.openDevTools();
	} else {
		win.webContents.openDevTools();
		win.loadFile('dist/eta-angular/index.html');

	}



	win.on('closed', () => {
		win.destroy();
	});



	ipcMain.handle('get-rotation', async (rotation: any, ...args: any[]) => {
		try {
			rotation = await rotationrRepo.findOne({
				where: {
					id: 1
				},
				relations: [
					'activityPerLocations', 'activityPerLocations.activities'],

			})



			return rotation
		} catch (err) {
			throw ('get-Rotation error: ' + err);
		}
	});




	ipcMain.handle('add-rotation', async (event: any, rotation: Rotation) => {

		try {
			let newRotation = rotation
			newRotation.id = 1
			await rotationrRepo.save(newRotation);
			return newRotation
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('add-country', async (event: any, country: Country) => {
		try {
			const newCountry = await countryRepo.create(country);
			await countryRepo.save(newCountry);
			return newCountry
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('add-pltStation', async (event: any, pltStation: PltStation, country: Country) => {
		try {

			let c = await countryRepo.findOne({
				where: {
					id: country.id
				},
				relations: {
					pltStations: true,
				},

			})
			if (c.pltStations === null || undefined) {
				c.pltStations = new Array<PltStation>
			}
			c.pltStations.push(pltStation)
			await countryRepo.save(c)
			return pltStation
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('add-port', async (event: any, port: Port, pltStation: PltStation) => {
		try {

			let c = await pltStationRepo.findOne({
				where: {
					id: pltStation.id
				},
				relations: {
					ports: true,
				},

			})

			if (c.ports === null || undefined) {
				c.ports = new Array<Port>
			}

			c.ports.push(port)
			await pltStationRepo.save(c)
			return port
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('add-berh', async (event: any, berth: Berth, port: Port) => {
		try {

			let c = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					berths: true,
				},

			})

			if (c.berths === null || undefined) {
				c.berths = new Array<Berth>
			}
			c.berths.push(berth)
			await portRepo.save(c)
			return berth
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('get-country', async (country: any, ...args: any[]) => {
		try {
			country = await countryRepo.find();
			return country
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	ipcMain.handle('get-pltStation-All', async (pltStation: any, ...args: any[]) => {
		try {
			pltStation = await pltStationRepo.find();

			return pltStation
		} catch (err) {
			throw ('get-Port error: ' + err);
		}
	});

	ipcMain.handle('get-pltStation', async (event: any, country: Country, ...args: any[]) => {
		try {

			country = await countryRepo.findOne({
				where: {
					id: country.id
				},
				relations: {
					pltStations: true
				}

			})

			return country.pltStations
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	ipcMain.handle('get-port', async (event: any, pltStation: PltStation, ...args: any[]) => {
		try {
			pltStation = await pltStationRepo.findOne({
				where: {
					id: pltStation.id
				},
				relations: {
					ports: true
				}

			})
			return pltStation.ports

		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	ipcMain.handle('get-berth', async (event: any, port: Port, ...args: any[]) => {
		try {
			port = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					berths: true
				}

			})
			return port.berths
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});


	ipcMain.handle('get-berth-by-port', async (event: any, portName: string, ...args: any[]) => {
		try {
			let port = await portRepo.findOne({
				where: {
					portName: portName
				},
				relations: {
					berths: true
				} 
			})

			let portList = []

			port.berths.map(p => {
				portList.push(p.berthName)
			})
  
			return portList
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	ipcMain.handle('get-berth-by-activityID', async (event: any, activity: Activity, ...args: any[]) => {
		try {
			let act : Activity = await activityRepo.findOne({
				where: {
					id: activity.id
				},
				relations: {
					activityPerLocation: true
				} 
			})

			let port = await portRepo.findOne({
				where: {
					portName: act.activityPerLocation.port
				},
				relations: {
					berths: true
				} 
			}) 
			let portList = []

			port.berths.map(p => {
				portList.push(p.berthName)
			})
   
			
			return portList
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	ipcMain.handle('delete-country', async (event: any, country: Country) => {
		try {
			await countryRepo
				.createQueryBuilder()
				.delete()
				.from(Country)
				.where("id = :id", { id: country.id })
				.execute()
			return countryRepo.find()
		} catch (err) {
			throw ('error port ' + err);
		}
	});

	ipcMain.handle('delete-port', async (event: any, port: Port) => {
		try {

			await portRepo
				.createQueryBuilder()
				.delete()
				.from(Port)
				.where("id = :id", { id: port.id })
				.execute()
			return portRepo.find()
		} catch (err) {
			throw ('error port ' + err);
		}
	});

	ipcMain.handle('delete-pltStation', async (event: any, pltStation: PltStation) => {
		try {
			await pltStationRepo
				.createQueryBuilder()
				.delete()
				.from(PltStation)
				.where("id = :id", { id: pltStation.id })
				.execute()
			return pltStationRepo.find()
		} catch (err) {
			throw ('error pltStation ' + err);
		}
	});

	ipcMain.handle('delete-berth', async (event: any, berth: Berth) => {
		try {
			await berthRepo
				.createQueryBuilder()
				.delete()
				.from(Berth)
				.where("id = :id", { id: berth.id })
				.execute()
			return berthRepo.find()
		} catch (err) {
			throw ('error bert ' + err);
		}
	});

	ipcMain.handle('add-bunker', async (event: any, bunkerOption: BunkerOption) => {
		try {

			await bunkerRepo.clear()
			const newBunker = await bunkerRepo.create(bunkerOption);
			await bunkerRepo.save(newBunker);
			return newBunker
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('get-bunker', async (bunkeOpt: any, ...args: any[]) => {
		try {
			bunkeOpt = await bunkerRepo.find();
			return bunkeOpt[0]
		} catch (err) {
			throw ('get-bunker error: ' + err);
		}
	});

	return win;
}


try {
	app.on('ready', () => setTimeout(createWindow, 400),
	)
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (win === null) {
			createWindow();
		}
	});

} catch (e) {
}
