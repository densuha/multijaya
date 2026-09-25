import { relations, sql } from "drizzle-orm";
import {
  datetime,
  double,
  index,
  int,
  json,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

const id = (name: string) => varchar(name, { length: 191 });
const createdAt = () => datetime("createdAt", { fsp: 3, mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP(3)`);
const updatedAt = () => datetime("updatedAt", { fsp: 3, mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`);

export const products = mysqlTable("Product", {
  id: id("id").primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  category: varchar("category", { length: 191 }).notNull(),
  price: int("price").notNull(),
  originalPrice: int("originalPrice"),
  stock: int("stock").notNull().default(0),
  unit: varchar("unit", { length: 191 }).notNull(),
  rating: double("rating").notNull().default(0),
  description: text("description").notNull(),
  image: text("image").notNull(),
  features: json("features").$type<string[]>().notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("Product_slug_key").on(table.slug)]);

export const categories = mysqlTable("Category", {
  id: id("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("Category_name_key").on(table.name)]);

export const orders = mysqlTable("Order", {
  id: id("id").primaryKey(),
  customerName: varchar("customerName", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 191 }).notNull(),
  address: text("address").notNull(),
  note: text("note"),
  total: int("total").notNull(),
  status: varchar("status", { length: 191 }).notNull().default("baru"),
  createdAt: createdAt(),
});

export const orderItems = mysqlTable("OrderItem", {
  id: id("id").primaryKey(),
  orderId: id("orderId").notNull().references(() => orders.id, { onDelete: "cascade", onUpdate: "cascade" }),
  productId: id("productId").notNull().references(() => products.id, { onDelete: "restrict", onUpdate: "cascade" }),
  productName: varchar("productName", { length: 191 }).notNull(),
  price: int("price").notNull(),
  quantity: int("quantity").notNull(),
}, (table) => [index("OrderItem_orderId_idx").on(table.orderId), index("OrderItem_productId_idx").on(table.productId)]);

export const siteSettings = mysqlTable("SiteSetting", {
  id: id("id").primaryKey(),
  key: varchar("key", { length: 191 }).notNull(),
  value: text("value").notNull(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("SiteSetting_key_key").on(table.key)]);

export const adminUsers = mysqlTable("AdminUser", {
  id: id("id").primaryKey(),
  username: varchar("username", { length: 191 }).notNull(),
  passwordHash: text("passwordHash").notNull(),
  role: varchar("role", { length: 191 }).notNull().default("admin"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [uniqueIndex("AdminUser_username_key").on(table.username)]);

export const productRelations = relations(products, ({ many }) => ({ orderItems: many(orderItems) }));
export const orderRelations = relations(orders, ({ many }) => ({ items: many(orderItems) }));
export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));