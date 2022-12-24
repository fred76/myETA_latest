import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import { DataSource } from 'typeorm';
import { Agency, AgencyOperator, Berth, BerthNotes, Country, CountryNotes, PltStation, Port, PortNotes } from '../src/shared/schema/location.schema';
import { BunkerOption } from '../src/shared/schema/bunker.schema';
import { Activity, ActivityPerLocation, Rotation } from '../src/shared/schema/rotation.schema';

import fs = require('fs');
import path = require('path');
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
		entities: [Country, Port, PltStation, Berth, BunkerOption, Rotation, ActivityPerLocation, Activity, CountryNotes, PortNotes, BerthNotes, Agency, AgencyOperator],
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
	const activityLocRepo = connection.getRepository(ActivityPerLocation);
	const activityRepo = connection.getRepository(Activity);
	const countryNotesRepo = connection.getRepository(CountryNotes);
	const portNotesRepo = connection.getRepository(PortNotes);
	const berthNotesRepo = connection.getRepository(BerthNotes);
	const agencyRepo = connection.getRepository(Agency);



	win = new BrowserWindow({
		x: 0,
		y: 0,
		width: size.width,
		height: size.height,
        autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			allowRunningInsecureContent: (serve),
			contextIsolation: false,
		},
	});


	if (serve) {
		win.loadFile('dist/eta-angular/index.html');
		win.show();
		// win.webContents.openDevTools();
	} else {
		// win.webContents.openDevTools();
		win.loadFile('dist/eta-angular/index.html');
	}



	win.on('closed', () => {
		win.destroy();
	});

	// COUNTRY & PORTS

	ipcMain.handle('add-country-ports', async (event: any, country: Country[]) => {
		try {
			let newCountry = country
			await countryRepo.save(newCountry);
			return newCountry
		} catch (err) {
			throw err;
		}
	});

	// ROTATION

	ipcMain.handle('get-rotation', async (rotation: any, ...args: any[]) => {

		try {

			rotation = await rotationrRepo.findOne({
				where: {
					id: 1
				},
				relations: [
					'activityPerLocations',
					'activityPerLocations.activities',
					// 'activityPerLocations.activities.agency',
				]
			})
			const location = await connection
				.getRepository(Rotation)
				.createQueryBuilder("rotation")
				.leftJoinAndSelect("rotation.activityPerLocations", "activityPerLocations")
				.leftJoinAndSelect("activityPerLocations.activities", "activities") 
				.leftJoinAndSelect("activities.agency", "agency")
				.leftJoinAndSelect("agency.operators", "operators")
				.getMany() 
			return location[0]
		} catch (err) {
			throw ('get-Rotation error: ' + err);
		}
	});

	ipcMain.handle('add-rotation', async (event: any, rotation: Rotation) => { 
		try {
			let newRotation = rotation
			rotation.id = 1
		 

			await rotationrRepo.save(newRotation);
 
			return newRotation
		} catch (err) {
			throw err;
		}
	});

	// Added

	ipcMain.handle('get-agency-by-port-name', async (event: any, portName: string, ...args: any[]) => {
		try {

			const port = await portRepo.findOne({
				where: {
					portName: portName
				},
				relations: ['agencies', 'agencies.operators'],
			})
			return port.agencies
		} catch (err) {
			throw ('get-port error: ' + err);
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

	// WWWW

	ipcMain.handle('get-agent-by-id', async (event: any, id: number, ...args: any[]) => {
		try {

			const agent = await agencyRepo.findOne({
				where: {
					id: id
				},
				relations: { operators: true },

			})
			return agent
		} catch (err) {
			throw ('get-port error: ' + err);
		}
	});

	ipcMain.handle('get-berth-by-activityID', async (event: any, activity: Activity, ...args: any[]) => {
		try {
			let act: Activity = await activityRepo.findOne({
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

	ipcMain.handle('get-pltStation-All', async (pltStation: any, ...args: any[]) => {
		try {
			pltStation = await pltStationRepo.find();

			return pltStation
		} catch (err) {
			throw ('get-Port error: ' + err);
		}
	});

	// NOTES COUNTRY

	ipcMain.handle('get-country-notes', async (event: any, country: Country, ...args: any[]) => {
		try {

			country = await countryRepo.findOne({
				where: {
					id: country.id
				},
				relations: {
					notes: true
				}

			})

			return country.notes
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	ipcMain.handle('add-country-notes', async (event: any, countryNote: CountryNotes, country: Country) => {
		try {

			let c = await countryRepo.findOne({
				where: {
					id: country.id
				},
				relations: {
					notes: true,
				},

			})
			if (c.notes === null || undefined) {
				c.notes = new Array<CountryNotes>
			}
			c.notes.push(countryNote)
			await countryRepo.save(c)
			return c.notes
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('edit-country-notes', async (event: any, countryNote: CountryNotes) => {
		try {
			let c = await countryNotesRepo
				.createQueryBuilder()
				.update(CountryNotes)
				.set({ countryNote: countryNote.countryNote, countryTitle: countryNote.countryTitle })
				.where("id = :id", { id: countryNote.id })
				.execute()
			return countryNotesRepo.find()
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('delete-country-notes', async (event: any, countryNote: CountryNotes) => {
		try {
			await countryNotesRepo
				.createQueryBuilder()
				.delete()
				.from(CountryNotes)
				.where("id = :id", { id: countryNote.id })
				.execute()
			return countryNotesRepo.find()
		} catch (err) {
			throw ('error countryNotesRepo ' + err);
		}
	});

	// NOTES PORT

	ipcMain.handle('get-port-notes', async (event: any, port: Port, ...args: any[]) => {
		try {

			port = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					notesPort: true
				}

			})

			return port.notesPort
		} catch (err) {
			throw ('get-port error: ' + err);
		}
	});

	ipcMain.handle('add-port-notes', async (event: any, portNote: PortNotes, port: Port) => {
		try {

			let c = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					notesPort: true,
				},

			})
			if (c.notesPort === null || undefined) {
				c.notesPort = new Array<PortNotes>
			}
			c.notesPort.push(portNote)
			await portRepo.save(c)
			return c.notesPort
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('edit-port-notes', async (event: any, portNote: PortNotes) => {
		try {
			let c = await portNotesRepo
				.createQueryBuilder()
				.update(PortNotes)
				.set({ portTitle: portNote.portNote, portNote: portNote.portNote })
				.where("id = :id", { id: portNote.id })
				.execute()
			return portNotesRepo.find()
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('delete-port-notes', async (event: any, portNote: PortNotes) => {
		try {
			const t = await portNotesRepo
				.createQueryBuilder()
				.delete()
				.from(PortNotes)
				.where("id = :id", { id: portNote.id })
				.execute()


			return portNotesRepo.find()
		} catch (err) {
			throw ('error countryNotesRepo ' + err);
		}
	});

	// NOTES BERTH

	ipcMain.handle('get-berth-notes', async (event: any, berth: Berth, ...args: any[]) => {
		try {

			berth = await berthRepo.findOne({
				where: {
					id: berth.id
				},
				relations: {
					notesBerth: true
				}

			})

			return berth.notesBerth
		} catch (err) {
			throw ('get-berth error: ' + err);
		}
	});

	ipcMain.handle('add-berth-notes', async (event: any, berthNote: BerthNotes, berth: Berth) => {
		try {

			let c = await berthRepo.findOne({
				where: {
					id: berth.id
				},
				relations: {
					notesBerth: true,
				},

			})
			if (c.notesBerth === null || undefined) {
				c.notesBerth = new Array<BerthNotes>
			}
			c.notesBerth.push(berthNote)
			await berthRepo.save(c)
			return c.notesBerth
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('edit-berth-notes', async (event: any, berthNote: BerthNotes) => {
		try {
			let c = await berthNotesRepo
				.createQueryBuilder()
				.update(BerthNotes)
				.set({ berthNote: berthNote.berthNote, berthTitle: berthNote.berthTitle })
				.where("id = :id", { id: berthNote.id })
				.execute()
			return berthNotesRepo.find()
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('delete-berth-notes', async (event: any, berthNote: BerthNotes) => {
		try {
			await berthNotesRepo
				.createQueryBuilder()
				.delete()
				.from(BerthNotes)
				.where("id = :id", { id: berthNote.id })
				.execute()
			return berthNotesRepo.find()
		} catch (err) {
			throw ('error countryNotesRepo ' + err);
		}
	});

	// PORT AGENCIES

	ipcMain.handle('get-port-agent', async (event: any, port: Port, ...args: any[]) => {
		try {

			port = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: ['agencies', 'agencies.operators'],


			})
			return port.agencies
		} catch (err) {
			throw ('get-port error: ' + err);
		}
	});

	ipcMain.handle('add-port-agent', async (event: any, agency: Agency, port: Port) => {
		try {

			let c = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					agencies: true,
				},

			})
			if (c.agencies === null || undefined) {
				c.agencies = new Array<Agency>
			}
			c.agencies.push(agency)
			await portRepo.save(c)
			return c.agencies
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('edit-port-agent-fromActivity', async (event: any, agency: Agency) => {

		try {
			let c = await agencyRepo.findOne({
				where: {
					id: agency.id
				},
				relations: ['operators', 'port'],

			})
			c.activities = agency.activities

			c.agencyName = agency.agencyName,
				c.agencyPhone = agency.agencyPhone,
				c.agencyPhone1 = agency.agencyPhone1,
				c.agencyCell24Hrs = agency.agencyCell24Hrs,
				c.agencyGeneralEmail = agency.agencyGeneralEmail,
				c.agencyAddress = agency.agencyAddress,
				c.noteAgency = agency.noteAgency,
				c.operators = agency.operators



			return await agencyRepo.save(c)
		} catch (err) {
			throw err;
		}
	});


	ipcMain.handle('edit-port-agent', async (event: any, agency: Agency) => {
		try {

			await agencyRepo.save(agency);
			return agencyRepo.find()
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('delete-port-agent', async (event: any, agency: Agency) => {
		try {
			const t = await agencyRepo
				.createQueryBuilder()
				.delete()
				.from(Agency)
				.where("id = :id", { id: agency.id })
				.execute()

			return agencyRepo.find()
		} catch (err) {
			throw ('error agencyRepo ' + err);
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

	// LOCATION PORT

	ipcMain.handle('add-port', async (event: any, port: Port, country: Country) => {
		try {

			let c = await countryRepo.findOne({
				where: {
					id: country.id
				},
				relations: {
					ports: true,
				},

			})

			if (c.ports === null || undefined) {
				c.ports = new Array<Port>
			}

			c.ports.push(port)
			await countryRepo.save(c)
			return port
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('get-port', async (event: any, country: Country, ...args: any[]) => {
		try {
			country = await countryRepo.findOne({
				where: {
					id: country.id
				},
				relations: {
					ports: true
				}

			})
			return country.ports

		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});

	// LOCATION PLTSTATION

	ipcMain.handle('add-pltStation', async (event: any, pltStation: PltStation, port: Port) => {
		try {

			let c = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					pltStations: true,
				},

			})
			if (c.pltStations === null || undefined) {
				c.pltStations = new Array<PltStation>
			}
			c.pltStations.push(pltStation)
			await portRepo.save(c)
			return pltStation
		} catch (err) {
			throw err;
		}
	});

	ipcMain.handle('get-pltStation', async (event: any, port: Port, ...args: any[]) => {
		try {

			port = await portRepo.findOne({
				where: {
					id: port.id
				},
				relations: {
					pltStations: true
				}

			})

			return port.pltStations
		} catch (err) {
			throw ('get-country error: ' + err);
		}
	});



	// LOCATION BERTH

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

	// ipcMain.handle('delete-berth', async (event: any, berth: Berth) => {

	// 	try {
	// 		await berthRepo
	// 			.createQueryBuilder()
	// 			.delete()
	// 			.from(Berth)
	// 			.where("id = :id", { id: berth.id })
	// 			.execute()
	// 		return berthRepo.find()
	// 	} catch (err) {
	// 		throw ('error bert ' + err);
	// 	}
	// });

	// BUNKER

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
	})


	ipcMain.on('export-rotation', async (event, rotation) => {
		try {

			const location = await connection
				.getRepository(Country)
				.createQueryBuilder("country")
				.leftJoinAndSelect("country.ports", "ports")
				.leftJoinAndSelect("country.notes", "notes")
				.leftJoinAndSelect("ports.notesPort", "notesPort")
				.leftJoinAndSelect("ports.berths", "berths")
				.leftJoinAndSelect("ports.pltStations", "pltStations")
				.leftJoinAndSelect("ports.agencies", "agencies")
				.leftJoinAndSelect("agencies.operators", "operators")
				.leftJoinAndSelect("berths.notesBerth", "notesBerth")

				.getMany()


			const bunker = await bunkerRepo.find()


			const total = { location, bunker, rotation }

			dialog.showSaveDialog({
				title: 'Export Rotation',
				defaultPath: path.join(__dirname, '../assets/Rotation.json'),
				buttonLabel: 'Save',
				filters: [
					{
						name: 'Text Files',
						extensions: ['json']
					},],
				properties: []
			}).then(file => {
				if (!file.canceled) {
					fs.writeFile(file.filePath.toString(),
						JSON.stringify(total), function (err) {
							if (err) throw err;
							console.log('Saved!');
						});

					fs.writeFile
				}
			}).catch(err => {
				throw 'Export 1: ' + err;
			});

		} catch (err) {
			throw 'Export 2: ' + err;
		}
	});

	ipcMain.on('import-rotation', (event) => {

		dialog.showOpenDialog({
			title: 'Pick a markdown file',
			filters: [
				{ name: 'json', extensions: ['json'] },
			],
			properties: ['openFile']
		}).then(async p => {
			try {
				if (!p.canceled) {
					await countryRepo.clear()
					await bunkerRepo.clear()
					await rotationrRepo.clear()
					let paths = p.filePaths;
					if (paths && paths.length > 0) {
						const content = fs.readFileSync(paths[0]).toString();
						let rot = JSON.parse(content)

						await countryRepo.save(rot.location);
						await bunkerRepo.save(rot.bunker[0])
						win.webContents.send('send-imported-rotation', {
							rot
						});
						return
					}
				}
			} catch (err) {
				throw "Import 1: " + err;
			}
		}).catch(err => {
			throw "Import 2: " + err;
		});


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
