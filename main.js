const { app, BrowserWindow, ipcMain } = require('electron');
const { DBManager } = require('./utils/DBManager');
const { CompanyModel } = require("./models/Company");
const { Client } = require('./models/Client');
const { Address } = require('./models/Address');
const { Product } = require('./models/Product');
const { Category } = require('./models/Category');
const { SubCategory } = require('./models/SubCategory');
const { Tax } = require('./models/Tax');
const electronReload = require('electron-reload');
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');

electronReload(__dirname);


let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: false,
		},
		title: "Billing System"
	});
	const startURL = 'http://localhost:3000'
	if (!DBManager.isInitialized) {
		DBManager.initialize().then(v => {
			mainWindow.loadURL(startURL);
		})
	}
	mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});


// Client module re-usable functions

async function getAllClientsList(args) {
	try {
		let skip = 0;
		const { page, limit } = args;

		let paginatedClients = [];
		let totalCountQuery;
		let totalCount;

		const clientRepo = DBManager.getRepository(Client);
		const addressRepo = DBManager.getRepository(Address);

		const queryBuilder = clientRepo.createQueryBuilder("client");

		// Add conditions for each field present in searchQuery
		if (args.searchQuery) {
			const { searchQuery } = args;
			if (searchQuery.clientId) {
				queryBuilder.andWhere("client.id = :id", { id: searchQuery.clientId });
			}
			if (searchQuery.email) {
				queryBuilder.andWhere("client.email LIKE :email", { email: `%${searchQuery.email}%` });
			}
			if (searchQuery.phone) {
				queryBuilder.andWhere("client.phone LIKE :phone", { phone: `%${searchQuery.phone}%` });
			}
			if (searchQuery.gstin) {
				queryBuilder.andWhere("client.gstin LIKE :gstin", { gstin: `%${searchQuery.gstin}%` });
			}
			if (searchQuery.contactName) {
				queryBuilder.andWhere("client.contact_name LIKE :contact_name", { contact_name: `%${searchQuery.contactName}%` });
			}
			totalCountQuery = queryBuilder.getCount();
		} else {
			totalCountQuery = clientRepo.count();
		}

		totalCount = await totalCountQuery;

		// Calculate skip value for pagination
		skip = (page - 1) * limit;

		// Find clients with pagination
		paginatedClients = await queryBuilder
			.skip(skip)
			.take(limit)
			.getMany();

		for (const client of paginatedClients) {
			const fullAddress = await addressRepo.find({ where: { id: client.billing_address } });
			client.billing_address = fullAddress[0].address;
			client.billing_address_id = fullAddress[0].id;
		}
		console.log({
			data: paginatedClients,
			page: parseInt(page),
			total: totalCount,
		});

		return {
			data: paginatedClients,
			page: parseInt(page),
			total: totalCount,
		};
	} catch (error) {
		console.log(error);
		return {
			success: true,
			data: [],
			page: parseInt(page),
			total: 0,
		}
	}
}

async function addNewClient(args) {
	try {
		const clientrepo = DBManager.getRepository(Client);
		const addressrepo = DBManager.getRepository(Address);

		// Create billing address entity
		const billingAddress = {
			address: args.billing_address,
			city: args.city,
			state: args.state,
			pincode: args.pincode,
			country: args.country,
		};

		// Insert billing address
		const billingAddressInsertResult = await addressrepo.insert(billingAddress);
		const billingAddressId = billingAddressInsertResult.identifiers[0].id;

		// Create client entity
		const client = {
			client_name: args.client_name,
			contact_name: args.contact_name || null,
			phone: args.phone || null,
			email: args.email || null,
			gstin: args.gstin || null,
			tin: args.tin || null,
			pan: args.pan || null,
			vat: args.vat || null,
			private_client_detail: args.private_detail || null,
			other_client_detail: args.other_detail || null,
			vendor: args.vendor || false,
			sez: args.sez || false,
			billing_address: billingAddressId,
			shipping_address: null,
			created_at: new Date(),
		};

		// If shipping address exists, insert and update client entity
		if (args.shipping_address) {
			const shippingAddress = {
				name: args.shipping_client_name,
				address: args.shipping_address,
				city: args.shipping_city,
				state: args.shipping_state,
				pincode: args.shipping_pincode,
				country: args.shipping_country,
			};

			const shippingAddressInsertResult = await addressrepo.insert(shippingAddress);
			const shippingAddressId = shippingAddressInsertResult.identifiers[0].id;

			client.shiping_address = shippingAddressId;
		}

		// Insert client entity
		await clientrepo.insert(client);

		return {
			success: true,
			message: 'Client added successfully!'
		};
	} catch (error) {
		console.error("Error adding new client:", error);
		return {
			success: false,
			message: error,
		};
	}
}

// Product module re-usable functions]

async function addNewProduct(args) {
	try {
		const productRepo = DBManager.getRepository(Product);

		const product = {
			p_type: args.p_type,
			uom: args.uom,
			sku: args.sku,
			product_name: args.product_name,
			purchase_price: args.purchase_price,
			keyword: args.keyword,
			category: args.category,
			sub_category: args.sub_category,
			opening_balance: args.opening_balance,
			opening_value: args.opening_value,
			opening_rate: args.opening_rate,
			storage_location: args.storage_location,
			sub_location: args.sub_location,
			hns: args.hns,
			sac: args.sac,
			unit_price: args.unit_price,
			currency: args.currency,
			tax: args.tax,
			quantity: args.quantity,
			cess: args.cess,
			description: args.description,
			created_at: new Date(),
		};

		const result = await productRepo.createQueryBuilder()
			.insert()
			.values(product)
			.execute();
		if (result) {
			return { success: true, message: 'Product added successfully' };
		}
	} catch (error) {
		return { success: false, message: 'Error while adding new product' };
	}
}

async function getAllProductsList(args) {
	try {
		let skip = 0;
		const { page, limit } = args;

		let paginatedProducts = [];
		let totalCountQuery;
		let totalCount;

		const productRepo = DBManager.getRepository(Product);
		const queryBuilder = productRepo.createQueryBuilder("product");

		// Add conditions for each field present in searchQuery
		if (args.searchQuery) {
			const { searchQuery } = args;
			if (searchQuery.productId) {
				queryBuilder.andWhere("product.id = :id", { id: searchQuery.productId });
			}
			if (searchQuery.sku) {
				queryBuilder.andWhere("product.sku LIKE :sku", { sku: `%${searchQuery.sku}%` });
			}
			if (searchQuery.minUnitPrice && searchQuery.maxUnitPrice) {
				queryBuilder.andWhere("product.unit_price >= :minUnitPrice AND product.unit_price <= :maxUnitPrice", { minUnitPrice: searchQuery.minUnitPrice, maxUnitPrice: searchQuery.maxUnitPrice });
			}
			if (searchQuery.minQuantity && searchQuery.maxQuantity) {
				queryBuilder.andWhere("product.quantity >= :minQuantity AND product.quantity <= :maxQuantity", { minQuantity: searchQuery.minQuantity, maxQuantity: searchQuery.maxQuantity });
			}
			if (searchQuery.startingDate && searchQuery.endingDate) {
				queryBuilder.andWhere("product.created_at >= :startingDate AND product.created_at <= :endingDate", { startingDate: searchQuery.startingDate, endingDate: searchQuery.endingDate });
			}
			if (searchQuery.contactName) {
				queryBuilder.andWhere("product.contact_name LIKE :contact_name", { contact_name: `%${searchQuery.contactName}%` });
			}
			if (searchQuery.reportType) {
				queryBuilder.andWhere("product.p_type = :p_type", { p_type: `%${searchQuery.reportType}%` });
			}

			totalCountQuery = queryBuilder.getCount();
		} else {
			totalCountQuery = productRepo.count();
		}

		totalCount = await totalCountQuery;

		// Calculate skip value for pagination
		skip = (page - 1) * limit;

		// Find clients with pagination
		paginatedProducts = await queryBuilder
			.skip(skip)
			.take(limit)
			.getMany();

		return {
			success: true,
			data: paginatedProducts,
			page: parseInt(page),
			total: totalCount,
		};
	} catch (error) {
		console.log(error);
		return {
			success: true,
			data: [],
			page: parseInt(page),
			total: 0,
		}
	}
}
// Company APIs 

ipcMain.handle("add-new-company", (ev, args) => {
	var companyrepo = DBManager.getRepository(CompanyModel)
	var addressrepo = DBManager.getRepository(Address)
	var company = {
		companyname: args.company_name,
		companypan: args.pan,
		tin: args.tin,
		vat: args.vat,
		service_tax_no: args.service_tax,
		cst_no: args.cst_no,
		phone: args.phone,
		email: args.email,
		website: args.website,
		additional_detail: args["add_detail"],
	}
	var address = {
		address: args.address,
		city: args.city,
		state: args.state,
		pincode: args.pincode,
		country: args.country,
	}
	return addressrepo.insert(address).then((v) => {
		company["addressid"] = v.identifiers[0].id
		return companyrepo.insert(company).then((ve) => { return "ok" }, (e) => { console.log(err); return "error" })
	}, (err) => { console.log(err); return "error" })
})

ipcMain.handle("company-sign-in", (ev, args) => {
	var companyrepo = DBManager.getRepository(CompanyModel)
	return companyrepo.findOneBy({ email: args.email, password: args.password })
})

// ----------------------------------------------------------------------------------------------------------------------------------------------

// Clients APIs

ipcMain.handle("add-new-client", async (ev, args) => {
	const result = await addNewClient(args)
	return result;
});

ipcMain.handle("get-client-by-id", async (ev, args) => {
	try {
		const { clientId } = args;
		const clientrepo = DBManager.getRepository(Client);
		const addressrepo = DBManager.getRepository(Address);

		const client = await clientrepo.findOne({ where: { id: clientId } });

		if (!client) {
			// Client with the provided ID does not exist
			return { success: false, message: "Client not found" };
		}

		if (client.billing_address) {
			const fullAddress = await addressrepo.find({ where: { id: client.billing_address } });
			client_billing_address_id = fullAddress[0].id,
				client.billing_address = fullAddress[0].address;
			client.country = fullAddress[0].country;
			client.state = fullAddress[0].state;
			client.city = fullAddress[0].city;
			client.pincode = fullAddress[0].pincode;
		}

		if (client.shiping_address) {
			const fullAddress = await addressrepo.find({ where: { id: client.shiping_address } });
			client.shipping_address_id = fullAddress[0].id,
				client.shipping_client_name = fullAddress[0].name
			client.shipping_address = fullAddress[0].address;
			client.shipping_country = fullAddress[0].country;
			client.shipping_state = fullAddress[0].state;
			client.shipping_city = fullAddress[0].city;
			client.shipping_pincode = fullAddress[0].pincode;
		}

		// Return client details
		return { success: true, client };
	} catch (error) {
		console.error("Error retrieving client:", error);
		return { success: false, message: "Error retrieving client" };
	}
});

ipcMain.handle("update-client", async (ev, args) => {
	try {
		const { clientId, clientFields, billingAddress, shippingAddress } = args;

		const clientRepo = DBManager.getRepository(Client);
		const addressrepo = DBManager.getRepository(Address);

		if (billingAddress) {
			const updateBillingAddressResult = await addressrepo
				.createQueryBuilder()
				.update(Address)
				.set(billingAddress)
				.where("id = :id", { id: billingAddress.id })
				.execute();
			if (!updateBillingAddressResult) {
				return {
					success: false,
					message: "An error occurred while updating address.",
				}
			}
		}

		if (shippingAddress) {
			const updateShippingAddressResult = await addressrepo
				.createQueryBuilder()
				.update(Address)
				.set(shippingAddress)
				.where("id = :id", { id: shippingAddress.id })
				.execute();
			if (!updateShippingAddressResult) {
				return {
					success: false,
					message: "An error occurred while updating address.",
				}
			}
		}

		const updateClientResult = await clientRepo
			.createQueryBuilder()
			.update(Client)
			.set(clientFields)
			.where("id = :id", { id: clientId })
			.execute();


		if (updateClientResult && updateClientResult.affected) {
			return { success: true, message: "Client updated successfully." };
		}

	} catch (error) {
		return { success: false, message: "An error occurred while updating client." };
	}
});

ipcMain.handle("delete-client-by-id", async (ev, args) => {
	try {
		const { clientId } = args;
		const clientRepo = DBManager.getRepository(Client);

		const deleteResult = await clientRepo
			.createQueryBuilder()
			.delete()
			.from(Client)
			.where("id = :id", { id: clientId })
			.execute();


		if (deleteResult && deleteResult.affected) {
			return { success: true, message: "Client deleted successfully." };
		}
	} catch (error) {
		console.error("Error deleting client:", error);
		return { success: false, message: "Error while deleting client" };
	}
});

// Get all  clients for drop-down
ipcMain.handle("get-all-client", async (ev, args) => {
	const clientrepo = DBManager.getRepository(Client);
	const data = await clientrepo.find();
	// console.log(data);
	return {
		data
	};
})

// Get all clients for clients list
ipcMain.handle("get-all-clients-list", async (ev, args) => {
	const result = await getAllClientsList(args);
	return result
});

ipcMain.handle("export-clients-to-excel", async (ev, args) => {
	try {
		// Call the API to get all clients with pagination and search query
		const response = await getAllClientsList(args);
		const clients = response.data

		// Create a new workbook
		const workbook = new ExcelJS.Workbook();

		// Add a worksheet
		const worksheet = workbook.addWorksheet('Clients');

		// Define the columns
		worksheet.columns = [
			{ header: 'Client Name', key: 'client_name', width: 20 },
			{ header: 'Contact Name', key: 'contact_name', width: 20 },
			{ header: 'Billing Address', key: 'billing_address', width: 20 },
			{ header: 'Email', key: 'email', width: 20 },
			{ header: 'Phone', key: 'phone', width: 20 },
			{ header: 'Private Client Detail', key: 'private_client_detail', width: 20 }
		];
		const addressrepo = DBManager.getRepository(Address);
		for (const client of clients) {
			// Retrieve full billing address
			const fullAddress = await addressrepo.find({ where: { id: client.billing_address_id } });

			// Add data to worksheet
			worksheet.addRow({
				client_name: client.client_name,
				contact_name: client.contact_name,
				billing_address: fullAddress[0].address,
				email: client.email,
				phone: client.phone,
				private_client_detail: client.private_client_detail
			});
		}
		// Generate a buffer from the workbook
		const buffer = await workbook.xlsx.writeBuffer();

		if (buffer) {
			return { success: true, buffer: buffer };
		} else {
			console.error("Error: Buffer is null.");
			return { success: false, error: "Buffer is null." };
		}
	} catch (error) {
		console.error("Error exporting clients:", error);
		return null;
	}
});

ipcMain.handle("download-client-sample-import-file", async (ev, args) => {
	try {
		// Create a new workbook
		const workbook = new ExcelJS.Workbook();

		// Add a worksheet
		const worksheet = workbook.addWorksheet('Demo');

		// Define headers
		const headers = [
			"Client Name",
			"Contact Name",
			"Client TIN",
			"Client VAT",
			"Email",
			"Phone",
			"Billing Address",
			"Billing Zip",
			"Billing City",
			"Billing State",
			"Billing Country",
			"Shipping Name",
			"Shipping Address",
			"Shipping Zip",
			"Shipping City",
			"Shipping State",
			"Shipping Country",
			"Private Details",
			"GSTIN",
			"PAN",
			"Balance"
		];

		// Add headers to the worksheet
		worksheet.addRow(headers);

		// Write the workbook to a buffer
		const buffer = await workbook.xlsx.writeBuffer();

		if (buffer) {
			// Return the buffer if it exists
			return { success: true, buffer: buffer };
		} else {
			// Log an error if buffer is null
			console.error("Error: Buffer is null.");
			return { success: false, error: "Buffer is null." };
		}
	} catch (error) {
		// Log any errors during the process
		console.error("Error generating sample import file:", error);
		return { error: error.message }; // Return the error message
	}
});

ipcMain.handle("import-clients-from-excel", async (ev, args) => {
	try {
		const file = args.fileData
		const filePath = file.path;
		const originalName = file.originalName;
		const array_of_allowed_files = ['xlsx'];
		const file_extension = originalName.slice(
			((originalName.lastIndexOf('.') - 1)) + 2);
		if (!array_of_allowed_files.includes(file_extension)) {
			return {
				success: false,
				message: "You can only upload excel file with extension .xlsx",
			}
		}

		const workbook = XLSX.readFile(filePath);

		// Get the first worksheet
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const data = XLSX.utils.sheet_to_json(worksheet);
		const excelClientCount = data.length;
		let successClientCount = 0;

		for (const client of data) {
			const clientObj = {
				client_name: client['Client Name'],
				contact_name: client['Contact Name'],
				tin: client['Client TIN'],
				vat: client['Client VAT'],
				email: client['Email'],
				phone: client['Phone'],
				gstin: client['GSTIN'],
				pan: client['PAN'],
				billing_address: client['Billing Address'],
				pincode: client['Billing Zip'],
				city: client['Billing City'],
				state: client['Billing State'],
				country: client['Billing Country'],
				shipping_client_name: client['Shipping Name'],
				shipping_address: client['Shipping Address'],
				shipping_pincode: client['Shipping Zip'],
				shipping_city: client['Shipping City'],
				shipping_state: client['Shipping State'],
				shipping_country: client['Shipping Country'],
				privateDetails: client['Private Details'],
				balance: client['Balance']
			};
			const response = await addNewClient(clientObj);
			if (response && response.success == true) {
				successClientCount++;
			}
		}
		if (excelClientCount == successClientCount) {
			return { success: true, message: "All clients imported successfully" };
		} else {
			return { success: false, message: `${successClientCount} clients added successfully  out of ${excelClientCount}` };
		}
	} catch (error) {
		console.error("Error importing clients from Excel:", error);
		return { success: false, message: "Error importing clients from Excel" };
	}
});

// ----------------------------------------------------------------------------------------------------------------------------------------------

// Product APIs

ipcMain.handle("add-new-product", async (ev, args) => {
	try {
		const response = await addNewProduct(args);
		return response;
	} catch (error) {
		console.log(error);
		return {
			success: false,
			message: 'Failed to add product'
		}
	}
})

ipcMain.handle("get-product-by-id", async (ev, args) => {
	try {
		const { productId } = args;

		// Retrieve the product from the database using the ID
		const productRepo = DBManager.getRepository(Product);
		const product = await productRepo.findOne({ where: { id: productId } });
		if (!product) {
			return { success: false, message: "Product not found" };
		}
		return { success: true, product };
	} catch (error) {
		console.error("Error retrieving product:", error);
		return { success: false, message: "Error retrieving product" };
	}
});

ipcMain.handle("update-product", async (ev, args) => {
	try {
		const { productId, updatedFields } = args;

		const productRepo = DBManager.getRepository(Product);
		const updateResult = await productRepo
			.createQueryBuilder()
			.update(Product)
			.set(updatedFields)
			.where("id = :id", { id: productId })
			.execute();

		if (updateResult) {
			return { success: true, message: "Product updated successfully." };
		}
	} catch (error) {
		console.log(error);
		return { success: false, message: "An error occurred while updating product." };
	}
});

ipcMain.handle("delete-product-by-id", async (ev, args) => {
	try {
		const { productId } = args;
		const productRepo = DBManager.getRepository(Product);

		const deleteResult = await productRepo
			.createQueryBuilder()
			.delete()
			.from(Product)
			.where("id = :id", { id: productId })
			.execute();

		if (deleteResult) {
			return { success: true, message: "Product deleted successfully." };
		}
	} catch (error) {
		console.log(error);
		return { success: false, message: "An error occurred while deleting product." };
	}
});

ipcMain.handle("get-all-product", async (ev, args) => {
	try {
		const productRepo = DBManager.getRepository(Product)
		const data = await productRepo.find();
		return {
			success: true,
			data
		};
	} catch (error) {
		console.log(error);
		return {
			success: true,
			data: [],
		}
	}
})

ipcMain.handle("get-all-products-list", async (ev, args) => {
	const result = await getAllProductsList(args);
	return result
});

ipcMain.handle("export-products-to-excel", async (ev, args) => {
	try {
		// Call the API to get all products with pagination and search query
		const response = await getAllProductsList(args);
		const products = response.data

		// Create a new workbook
		const workbook = new ExcelJS.Workbook();

		// Add a worksheet
		const worksheet = workbook.addWorksheet('Products');

		// Define the columns
		worksheet.columns = [
			{ header: 'Product Name', key: 'product_name', width: 20 },
			{ header: 'Unit Price', key: 'unit_price', width: 20 },
			{ header: 'Uom', key: 'uom', width: 20 },
			{ header: 'Quantity', key: 'quantity', width: 20 },
			{ header: 'Description', key: 'description', width: 20 },
			{ header: 'Type', key: 'p_type', width: 20 },
			{ header: 'Purchase Rate', key: 'purchase_price', width: 20 },
			{ header: 'Purchase Rate Currency', key: 'currency', width: 20 },
			{ header: 'HSN', key: 'hsn', width: 20 },
			{ header: 'SAC', key: 'sac', width: 20 },
			{ header: 'SKU', key: 'sku', width: 20 },
			{ header: 'Tax(%)', key: 'tax', width: 20 },
			{ header: 'CESS', key: 'cess', width: 20 },
		];

		for (const product of products) {
			worksheet.addRow({
				product_name: product.product_name,
				unit_price: product.unit_price,
				uom: product.uom,
				quantity: product.quantity,
				description: product.description,
				p_type: product.p_type,
				purchase_price: product.purchase_price,
				currency: product.currency,
				hsn: product.hns,
				sac: product.sac,
				sku: product.sku,
				tax: product.tax,
				cess: product.cess,
			});
		}
		// Generate a buffer from the workbook
		const buffer = await workbook.xlsx.writeBuffer();

		if (buffer) {
			return { success: true, buffer: buffer };
		} else {
			console.error("Error: Buffer is null.");
			return { success: false, error: "Buffer is null." };
		}
	} catch (error) {
		console.error("Error exporting products:", error);
		return null;
	}
});

ipcMain.handle("download-product-sample-import-file", async (ev, args) => {
	try {
		// Create a new workbook
		const workbook = new ExcelJS.Workbook();

		// Add a worksheet
		const worksheet = workbook.addWorksheet('Demo');

		// Define headers
		const headers = [
			"Product Name",
			"Unit Price",
			"Uom",
			"Quantity",
			"Description",
			"Type",
			"Purchase Rate",
			"Purchase Rate Currency",
			"Alias",
			"Category",
			"Sub Category",
			"Opening Balance",
			"Opening Value",
			"Opening Rate",
			"Storage Location",
			"Sub Location",
			"HSN",
			"SAC",
			"SKU",
			"Tax(%)",
			"CESS"
		];

		// Add headers to the worksheet
		worksheet.addRow(headers);

		// Write the workbook to a buffer
		const buffer = await workbook.xlsx.writeBuffer();

		if (buffer) {
			// Return the buffer if it exists
			return { success: true, buffer: buffer, message: "Sample product import file downloaded successfully." };
		}
	} catch (error) {
		// Log any errors during the process
		console.error("Error generating sample product import file:", error);
		return { error: error.message }; // Return the error message
	}
});

ipcMain.handle("import-products-from-excel", async (ev, args) => {
	try {
		const file = args.fileData
		const filePath = file.path;
		const originalName = file.originalName;
		const array_of_allowed_files = ['xlsx'];
		const file_extension = originalName.slice(
			((originalName.lastIndexOf('.') - 1)) + 2);
		if (!array_of_allowed_files.includes(file_extension)) {
			return {
				success: false,
				message: "You can only upload excel file with extension .xlsx",
			}
		}

		const workbook = XLSX.readFile(filePath);

		// Get the first worksheet
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const data = XLSX.utils.sheet_to_json(worksheet);
		const excelProductCount = data.length;
		let successProductCount = 0;

		// 	additional: args.additional,
		for (const product of data) {
			const productObj = {
				product_name: product['Product Name'],
				unit_price: product['Unit Price'],
				uom: product['Uom'],
				qty: product['Quantity'],
				description: product['Description'],
				p_type: product['Type'],
				purchase_price: product['Purchase Rate'],
				currency: product['Purchase Rate Currency'],
				keyword: product['Alias'],
				category: product["Category"],
				sub_category: product["Sub Category"],
				opening_balance: product["Opening Balance"],
				opening_value: product["Opening Value"],
				opening_rate: product["Opening Rate"],
				storage_location: product["Storage Location"],
				sub_location: product["Sub Location"],
				hns: product['HSN'],
				sac: product['SAC'],
				sku: product['SKU'],
				tax: product['Tax(%)'],
				cess: product['CESS'],
			};
			console.log({ productObj });
			const response = await addNewProduct(productObj);
			if (response && response.success == true) {
				successProductCount++;
			}
		}
		if (excelProductCount == successProductCount) {
			return { success: true, message: "All products imported successfully" };
		} else {
			return { success: false, message: `${successProductCount} products added successfully  out of ${excelProductCount}` };
		}
	} catch (error) {
		console.error("Error importing products from Excel:", error);
		return { success: false, message: "Error importing products from Excel" };
	}
});

// ----------------------------------------------------------------------------------------------------------------------------------------------

// Category and Sub-Category APIs

ipcMain.handle("add-new-category", async (ev, args) => {
	try {
		const categoryRepo = DBManager.getRepository(Category);
		const category = {
			name: args.name,
			is_default: args.is_default,
		}
		const result = await categoryRepo.insert(category);
		return {
			success: true,
			data: { category_id: result.raw },
			message: 'Category added successfully',
		};
	} catch (error) {
		console.error("Error adding new category:", error);
		return { success: false, message: 'Error adding new category' };
	}
})

ipcMain.handle("add-new-sub-category", async (ev, args) => {
	try {
		const { category_id, name } = args;
		const subCategoryRepo = DBManager.getRepository(SubCategory);

		const subCategory = {
			category_id,
			name,
		}
		const result = await subCategoryRepo.createQueryBuilder()
			.insert()
			.values(subCategory)
			.execute();
		if (result && result.raw && result.raw.affectedRows > 0) {
			return {
				success: true,
				data: { sub_category_id: result.raw.insertId },
				message: 'Sub Category added successfully',
			};
		} else {
			return { success: false, message: 'Failed to add sub-category' };
		}
	} catch (error) {
		console.error("Error adding new sub-category:", error);
		return { success: false, message: 'Error adding new sub-category' };
	}
})

ipcMain.handle("get-sub-categories-by-category-id", async (ev, args) => {
	try {
		const { category_id } = args;
		const subCategoryRepo = DBManager.getRepository(SubCategory);

		const subCategories = await subCategoryRepo.createQueryBuilder()
			.select()
			.where("category_id = :category_id", { category_id })
			.getMany();

		if (subCategories.length) {
			return {
				success: true,
				data: subCategories,
				message: 'Sub-categories fetched successfully',
			};
		}
	} catch (error) {
		console.error(`Error fetching sub-categories by category ID`, error);
		return {
			success: true,
			data: [],
		};
	}
})

ipcMain.handle("get-all-categories", async () => {
	try {
		const categoryRepo = DBManager.getRepository(Category);

		const categories = await categoryRepo.createQueryBuilder("category")
			.getMany();

		if (categories.length) {
			return {
				success: true,
				data: categories,
				message: 'Categories fetched successfully',
			};
		} else {
			return {
				success: true,
				data: [],
				message: 'Categories fetched successfully',
			};
		}
	} catch (error) {
		console.error("Error fetching all categories:", error);
		return {
			success: true,
			data: [],
		};
	}
})

ipcMain.handle("get-category-by-id", async (ev, args) => {
	try {
		const { id } = args;
		const categoryRepo = DBManager.getRepository(Category);

		// Find category by ID
		const category = await categoryRepo.findOne({ where: { id } });

		// Check if category exists
		if (!category) {
			return { success: false, message: 'Category not found' };
		}

		// Return the found category
		return {
			success: true,
			data: category,
		};
	} catch (error) {
		console.error("Error fetching category by ID:", error);
		return {
			success: false,
			message: 'Error occurred while fetching category by id'
		};
	}
})

ipcMain.handle("delete-category-by-id", async (ev, args) => {
	try {
		const { category_id } = args;

		const categoryRepo = DBManager.getRepository(Category);
		const subCategoryRepo = DBManager.getRepository(SubCategory);

		// Find the category by ID
		const category = await categoryRepo.findOne({ where: { id: category_id } });

		// Check if category exists
		if (!category) {
			return { success: false, message: 'Category not found' };
		}

		// Delete all the sub categories associated with category
		await subCategoryRepo.createQueryBuilder()
			.delete()
			.where("category_id = :category_id", { category_id })
			.execute();


		// Delete the category
		await categoryRepo.createQueryBuilder()
			.delete()
			.from(Category)
			.where("id = :id", { id: category_id })
			.execute();

		return { success: true, message: 'Category deleted successfully' };
	} catch (error) {
		console.error("Error deleting category:", error);
		return { success: false, message: 'Error deleting category' };
	}
})

ipcMain.handle("delete-sub-category-by-id", async (ev, args) => {
	try {
		const { id } = args;
		const subCategoryRepo = DBManager.getRepository(SubCategory);

		// Find the category by ID
		const category = await subCategoryRepo.findOne({ where: { id } });

		// Check if category exists
		if (!category) {
			return { success: false, message: 'Category not found' };
		}

		// Delete the category
		await subCategoryRepo.createQueryBuilder()
			.delete()
			.from(SubCategory)
			.where("id = :id", { id })
			.execute();

		return { success: true, message: 'Sub Category deleted successfully' };
	} catch (error) {
		console.error("Error deleting category:", error);
		return { success: false, message: 'Error deleting category' };
	}
})

// ----------------------------------------------------------------------------------------------------------------------------------------------

// Tax APIs

ipcMain.handle("add-new-tax", async (ev, args) => {
	try {
		const { name, tax_rate, is_default } = args;
		const taxRepo = DBManager.getRepository(Tax);

		const tax = {
			name,
			tax_rate,
			is_default,
		};
		const result = await taxRepo.createQueryBuilder()
			.insert()
			.values(tax)
			.execute();

		return {
			success: true,
			data: { tax_id: result.raw },
			message: "New tax added successfully!"
		}
	} catch (error) {
		console.error("Error adding new tax:", error);
		return { success: false, message: 'Error adding new tax' };
	}
})

ipcMain.handle("get-all-taxes", async () => {
	try {
		const taxRepo = DBManager.getRepository(Tax);

		const taxes = await taxRepo.find();

		return {
			success: true,
			data: taxes,
			message: 'Taxes fetched successfully',
		}
	} catch (error) {
		console.error("Error fetching all taxes:", error);
		return {
			success: false,
			data: [],
			message: 'Error fetching all taxes'
		};
	}
})

ipcMain.handle("update-tax", async (ev, args) => {
	try {
		const { id, name, tax_rate, is_default } = args;
		const taxRepo = DBManager.getRepository(Tax);

		// Check if the updated name already exists in the table
		const existingTax = await taxRepo.findOne({ where: { id } });
		if (existingTax && existingTax.id !== id) {
			return { success: false, message: 'Tax with this tax rate already exists' };
		}

		const result = await taxRepo.createQueryBuilder()
			.update()
			.set({ name, tax_rate, is_default })
			.where("id = :id", { id })
			.execute();

		return { success: true, message: 'Tax updated successfully' };
	} catch (error) {
		console.error("Error updating tax:", error);
		return { success: false, message: 'Error updating tax' };
	}
})

ipcMain.handle("delete-tax-by-id", async (ev, args) => {
	try {
		const { id } = args;
		const taxRepo = DBManager.getRepository(Tax);

		// Check if tax exists
		const existingTax = await taxRepo.findOne({ where: { id } });
		if (!existingTax) {
			return { success: false, message: 'Tax not found' };
		}

		// Delete tax
		await taxRepo
			.createQueryBuilder()
			.delete()
			.from(Tax)
			.where("id = :id", { id })
			.execute();

		return { success: true, message: 'Tax deleted successfully' };
	} catch (error) {
		console.error("Error deleting tax:", error);
		return { success: false, message: 'Error deleting tax' };
	}
})

ipcMain.handle("get-tax-by-id", async (ev, args) => {
	try {
		const { id } = args;
		const taxRepo = DBManager.getRepository(Tax);

		// Find tax by ID
		const tax = await taxRepo.findOne({ where: { id } });

		// Check if tax exists
		if (!tax) {
			return { success: false, message: 'Tax not found' };
		}

		// Return the found tax
		return {
			success: true,
			data: tax,
		};
	} catch (error) {
		console.error("Error fetching tax by ID:", error);
		return { success: false, message: `Error fetching tax by ID: ${args.id}` };
	}
})

// -----------------------------------------------------------------------------------------------------------------------------------------------

