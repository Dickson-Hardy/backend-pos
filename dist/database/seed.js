"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
async function seed() {
    console.log('🚀 Starting comprehensive database seeding...');
    console.log('🔗 Database:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@'));
    try {
        const { NestFactory } = await Promise.resolve().then(() => require('@nestjs/core'));
        const { AppModule } = await Promise.resolve().then(() => require('../app.module'));
        const { getModelToken } = await Promise.resolve().then(() => require('@nestjs/mongoose'));
        const bcrypt = await Promise.resolve().then(() => require('bcrypt'));
        const { User, UserRole, UserStatus } = await Promise.resolve().then(() => require('../schemas/user.schema'));
        const { Outlet, OutletStatus } = await Promise.resolve().then(() => require('../schemas/outlet.schema'));
        const { Product, ProductCategory, ProductStatus, UnitOfMeasure } = await Promise.resolve().then(() => require('../schemas/product.schema'));
        const { Sale, PaymentMethod, SaleStatus } = await Promise.resolve().then(() => require('../schemas/sale.schema'));
        console.log('🏗️ Creating application context...');
        const app = await NestFactory.createApplicationContext(AppModule, {
            logger: ['error', 'warn']
        });
        const userModel = app.get(getModelToken(User.name));
        const outletModel = app.get(getModelToken(Outlet.name));
        const productModel = app.get(getModelToken(Product.name));
        const saleModel = app.get(getModelToken(Sale.name));
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            userModel.deleteMany({}),
            outletModel.deleteMany({}),
            productModel.deleteMany({}),
            saleModel.deleteMany({})
        ]);
        const hashedPassword = await bcrypt.hash('admin@2025', 10);
        console.log('🏪 Creating outlets...');
        const outlets = await outletModel.insertMany([
            {
                name: 'Main Pharmacy',
                address: '123 Health Street',
                city: 'Medical District',
                state: 'CA',
                zipCode: '90210',
                phone: '+1-555-0101',
                email: 'main@pharmpos.com',
                licenseNumber: 'PH-001-2024',
                status: OutletStatus.ACTIVE
            },
            {
                name: 'Downtown Branch',
                address: '456 Commerce Ave',
                city: 'Downtown',
                state: 'CA',
                zipCode: '90211',
                phone: '+1-555-0102',
                email: 'downtown@pharmpos.com',
                licenseNumber: 'PH-002-2024',
                status: OutletStatus.ACTIVE
            },
            {
                name: 'Hospital Pharmacy',
                address: '789 Medical Center Dr',
                city: 'Hospital District',
                state: 'CA',
                zipCode: '90212',
                phone: '+1-555-0103',
                email: 'hospital@pharmpos.com',
                licenseNumber: 'PH-003-2024',
                status: OutletStatus.ACTIVE
            }
        ]);
        console.log(`✅ Created ${outlets.length} outlets`);
        console.log('👥 Creating users...');
        const users = await userModel.insertMany([
            {
                firstName: 'John',
                lastName: 'Admin',
                email: 'admin@pharmpos.com',
                password: hashedPassword,
                role: UserRole.ADMIN,
                status: UserStatus.ACTIVE,
                phone: '+1-555-1001',
                outletId: outlets[0]._id
            },
            {
                firstName: 'Sarah',
                lastName: 'Manager',
                email: 'manager@pharmpos.com',
                password: hashedPassword,
                role: UserRole.MANAGER,
                status: UserStatus.ACTIVE,
                phone: '+1-555-1003',
                outletId: outlets[0]._id
            },
            {
                firstName: 'Emma',
                lastName: 'Cashier',
                email: 'cashier@pharmpos.com',
                password: hashedPassword,
                role: UserRole.CASHIER,
                status: UserStatus.ACTIVE,
                phone: '+1-555-1007',
                outletId: outlets[0]._id
            },
            {
                firstName: 'Lisa',
                lastName: 'Supervisor',
                email: 'supervisor@pharmpos.com',
                password: hashedPassword,
                role: UserRole.MANAGER,
                status: UserStatus.ACTIVE,
                phone: '+1-555-1011',
                outletId: outlets[1]._id
            }
        ]);
        console.log(`✅ Created ${users.length} users`);
        console.log('💊 Creating extensive product catalog...');
        const products = await productModel.insertMany([
            {
                name: 'Acetaminophen 500mg Tablets',
                description: 'Pain reliever and fever reducer. Extra strength formula for effective relief of headaches, muscle aches, and fever.',
                category: ProductCategory.PAIN_RELIEF,
                manufacturer: 'Johnson & Johnson',
                genericName: 'Acetaminophen',
                strength: '500mg',
                barcode: '300450123456',
                sku: 'ACE-500-100',
                sellingPrice: 12990,
                costPrice: 8500,
                unitOfMeasure: UnitOfMeasure.TABLETS,
                packSize: 100,
                status: ProductStatus.ACTIVE,
                requiresPrescription: false,
                currentStock: 250,
                reorderLevel: 50,
                maxStock: 500
            },
            {
                name: 'Amoxicillin 250mg Capsules',
                description: 'Broad-spectrum antibiotic for treating bacterial infections including respiratory, urinary tract, and skin infections.',
                category: ProductCategory.ANTIBIOTICS,
                manufacturer: 'GlaxoSmithKline',
                genericName: 'Amoxicillin',
                strength: '250mg',
                barcode: '300450234567',
                sku: 'AMX-250-30',
                sellingPrice: 18750,
                costPrice: 12250,
                unitOfMeasure: UnitOfMeasure.CAPSULES,
                packSize: 30,
                status: ProductStatus.ACTIVE,
                requiresPrescription: true,
                currentStock: 120,
                reorderLevel: 30,
                maxStock: 200
            },
            {
                name: 'Lisinopril 10mg Tablets',
                description: 'ACE inhibitor used to treat high blood pressure and heart failure. Helps prevent strokes, heart attacks, and kidney problems.',
                category: ProductCategory.CARDIOVASCULAR,
                manufacturer: 'Merck & Co',
                genericName: 'Lisinopril',
                strength: '10mg',
                barcode: '300450345678',
                sku: 'LIS-10-90',
                sellingPrice: 24500,
                costPrice: 16800,
                unitOfMeasure: UnitOfMeasure.TABLETS,
                packSize: 90,
                status: ProductStatus.ACTIVE,
                requiresPrescription: true,
                currentStock: 200,
                reorderLevel: 40,
                maxStock: 300
            },
            {
                name: 'Metformin 500mg Extended Release',
                description: 'Extended-release diabetes medication that helps control blood sugar levels in type 2 diabetes patients.',
                category: ProductCategory.DIABETES,
                manufacturer: 'Bristol Myers Squibb',
                genericName: 'Metformin HCl',
                strength: '500mg',
                barcode: '300450456789',
                sku: 'MET-500XR-60',
                sellingPrice: 32250,
                costPrice: 21500,
                unitOfMeasure: UnitOfMeasure.TABLETS,
                packSize: 60,
                status: ProductStatus.ACTIVE,
                requiresPrescription: true,
                currentStock: 180,
                reorderLevel: 45,
                maxStock: 300
            },
            {
                name: 'Omeprazole 20mg Delayed Release',
                description: 'Proton pump inhibitor for treating gastroesophageal reflux disease (GERD), stomach ulcers, and heartburn.',
                category: ProductCategory.GASTROINTESTINAL,
                manufacturer: 'AstraZeneca',
                genericName: 'Omeprazole',
                strength: '20mg',
                barcode: '300450567890',
                sku: 'OME-20DR-30',
                sellingPrice: 28990,
                costPrice: 19750,
                unitOfMeasure: UnitOfMeasure.CAPSULES,
                packSize: 30,
                status: ProductStatus.ACTIVE,
                requiresPrescription: false,
                currentStock: 160,
                reorderLevel: 35,
                maxStock: 250
            },
            {
                name: 'Atorvastatin 40mg Tablets',
                description: 'HMG-CoA reductase inhibitor (statin) used to lower cholesterol and reduce risk of heart disease.',
                category: ProductCategory.CARDIOVASCULAR,
                manufacturer: 'Pfizer',
                genericName: 'Atorvastatin Calcium',
                strength: '40mg',
                barcode: '300450678901',
                sku: 'ATO-40-90',
                sellingPrice: 45750,
                costPrice: 31250,
                unitOfMeasure: UnitOfMeasure.TABLETS,
                packSize: 90,
                status: ProductStatus.ACTIVE,
                requiresPrescription: true,
                currentStock: 140,
                reorderLevel: 40,
                maxStock: 250
            },
            {
                name: 'Albuterol Inhaler 90mcg',
                description: 'Fast-acting bronchodilator inhaler for treating asthma and COPD symptoms. Provides quick relief of breathing difficulties.',
                category: ProductCategory.RESPIRATORY,
                manufacturer: 'Teva Pharmaceuticals',
                genericName: 'Albuterol Sulfate',
                strength: '90mcg',
                barcode: '300450789012',
                sku: 'ALB-90MCG-200',
                sellingPrice: 65500,
                costPrice: 42750,
                unitOfMeasure: UnitOfMeasure.INHALERS,
                packSize: 1,
                status: ProductStatus.ACTIVE,
                requiresPrescription: true,
                currentStock: 75,
                reorderLevel: 20,
                maxStock: 120
            },
            {
                name: 'Sertraline 50mg Tablets',
                description: 'SSRI antidepressant for treating depression, anxiety disorders, PTSD, and obsessive-compulsive disorder.',
                category: ProductCategory.MENTAL_HEALTH,
                manufacturer: 'Pfizer',
                genericName: 'Sertraline HCl',
                strength: '50mg',
                barcode: '300450890123',
                sku: 'SER-50-30',
                sellingPrice: 38.25,
                costPrice: 25.50,
                unitOfMeasure: UnitOfMeasure.TABLETS,
                packSize: 30,
                status: ProductStatus.ACTIVE,
                requiresPrescription: true,
                currentStock: 90,
                reorderLevel: 25,
                maxStock: 150
            },
            {
                name: 'Vitamin D3 1000 IU Softgels',
                description: 'Essential vitamin D3 supplement for bone health, immune system support, and calcium absorption.',
                category: ProductCategory.VITAMINS,
                manufacturer: 'Nature Made',
                genericName: 'Cholecalciferol',
                strength: '1000 IU',
                barcode: '300450901234',
                sku: 'VD3-1000-100',
                sellingPrice: 16.99,
                costPrice: 11.25,
                unitOfMeasure: UnitOfMeasure.SOFTGELS,
                packSize: 100,
                status: ProductStatus.ACTIVE,
                requiresPrescription: false,
                currentStock: 200,
                reorderLevel: 50,
                maxStock: 350
            },
            {
                name: 'Hydrocortisone Cream 1%',
                description: 'Topical corticosteroid cream for treating skin inflammation, itching, and minor skin irritations.',
                category: ProductCategory.DERMATOLOGY,
                manufacturer: 'Johnson & Johnson',
                genericName: 'Hydrocortisone',
                strength: '1%',
                barcode: '300451012345',
                sku: 'HYD-1%-30G',
                sellingPrice: 8.75,
                costPrice: 5.50,
                unitOfMeasure: UnitOfMeasure.TUBES,
                packSize: 1,
                status: ProductStatus.ACTIVE,
                requiresPrescription: false,
                currentStock: 85,
                reorderLevel: 20,
                maxStock: 150
            }
        ]);
        console.log(`✅ Created ${products.length} products`);
        console.log('💰 Creating sample sales...');
        const sampleSales = [];
        for (let i = 0; i < 15; i++) {
            const randomOutlet = outlets[Math.floor(Math.random() * outlets.length)];
            const randomCashier = users.find(u => u.outletId.toString() === randomOutlet._id.toString() && u.role === UserRole.CASHIER) || users[0];
            const saleDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const itemCount = Math.floor(Math.random() * 4) + 1;
            const saleItems = [];
            let subtotal = 0;
            for (let j = 0; j < itemCount; j++) {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const itemTotal = randomProduct.sellingPrice * quantity;
                saleItems.push({
                    productId: randomProduct._id,
                    productName: randomProduct.name,
                    quantity,
                    unitPrice: randomProduct.sellingPrice,
                    total: itemTotal,
                    batchNumber: 'BATCH001'
                });
                subtotal += itemTotal;
            }
            const tax = subtotal * 0.085;
            const total = subtotal + tax;
            sampleSales.push({
                saleNumber: `SALE-${String(i + 1).padStart(6, '0')}`,
                receiptNumber: `RCP-${String(i + 1).padStart(6, '0')}`,
                outletId: randomOutlet._id,
                cashierId: randomCashier._id,
                items: saleItems,
                subtotal,
                tax,
                discount: 0,
                total,
                paymentMethod: Math.random() > 0.5 ? PaymentMethod.CASH : PaymentMethod.CARD,
                status: SaleStatus.COMPLETED,
                createdAt: saleDate,
                updatedAt: saleDate,
                customerInfo: {
                    name: `Customer ${i + 1}`,
                    phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                    email: `customer${i + 1}@email.com`
                }
            });
        }
        await saleModel.insertMany(sampleSales);
        console.log(`✅ Created ${sampleSales.length} sample sales`);
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   • ${outlets.length} outlets created`);
        console.log(`   • ${users.length} users created`);
        console.log(`   • ${products.length} products with barcodes`);
        console.log(`   • ${sampleSales.length} sample sales`);
        console.log('\n🔐 Login credentials (password: admin@2025):');
        console.log('   • admin@pharmpos.com (Admin)');
        console.log('   • manager@pharmpos.com (Manager)');
        console.log('   • cashier@pharmpos.com (Cashier)');
        console.log('   • supervisor@pharmpos.com (Manager)');
        await app.close();
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
seed()
    .then(() => {
    console.log('✅ Seeding process completed successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Seeding process failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map