import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_features_icon" AS ENUM('favorite', 'visibility', 'directions_walk');
  CREATE TABLE "team_members_short_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "team_members_full_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"is_founder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ministers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"logo_id" integer NOT NULL,
  	"instagram_url" varchar,
  	"facebook_url" varchar,
  	"live_stream_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_date" varchar NOT NULL,
  	"verse" varchar NOT NULL,
  	"main_logo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_features_icon" DEFAULT 'favorite' NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "support_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "support_ways_to_support_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "support_ways_to_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "support" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"thank_you_title" varchar NOT NULL,
  	"thank_you_text" varchar NOT NULL,
  	"thank_you_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "not_found" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"image_id" integer,
  	"button_text" varchar NOT NULL,
  	"button_link" varchar DEFAULT '/' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ministers_id" integer;
  ALTER TABLE "team_members_short_bio" ADD CONSTRAINT "team_members_short_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members_full_bio" ADD CONSTRAINT "team_members_full_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ministers" ADD CONSTRAINT "ministers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_main_logo_id_media_id_fk" FOREIGN KEY ("main_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_paragraphs" ADD CONSTRAINT "about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_features" ADD CONSTRAINT "about_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "support_story" ADD CONSTRAINT "support_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "support_ways_to_support_paragraphs" ADD CONSTRAINT "support_ways_to_support_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."support_ways_to_support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "support_ways_to_support" ADD CONSTRAINT "support_ways_to_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."support"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "support" ADD CONSTRAINT "support_thank_you_image_id_media_id_fk" FOREIGN KEY ("thank_you_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "not_found" ADD CONSTRAINT "not_found_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "team_members_short_bio_order_idx" ON "team_members_short_bio" USING btree ("_order");
  CREATE INDEX "team_members_short_bio_parent_id_idx" ON "team_members_short_bio" USING btree ("_parent_id");
  CREATE INDEX "team_members_full_bio_order_idx" ON "team_members_full_bio" USING btree ("_order");
  CREATE INDEX "team_members_full_bio_parent_id_idx" ON "team_members_full_bio" USING btree ("_parent_id");
  CREATE INDEX "team_members__order_idx" ON "team_members" USING btree ("_order");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX "ministers__order_idx" ON "ministers" USING btree ("_order");
  CREATE INDEX "ministers_photo_idx" ON "ministers" USING btree ("photo_id");
  CREATE INDEX "ministers_updated_at_idx" ON "ministers" USING btree ("updated_at");
  CREATE INDEX "ministers_created_at_idx" ON "ministers" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "home_main_logo_idx" ON "home" USING btree ("main_logo_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_media_id_idx" ON "home_rels" USING btree ("media_id");
  CREATE INDEX "about_paragraphs_order_idx" ON "about_paragraphs" USING btree ("_order");
  CREATE INDEX "about_paragraphs_parent_id_idx" ON "about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_features_order_idx" ON "about_features" USING btree ("_order");
  CREATE INDEX "about_features_parent_id_idx" ON "about_features" USING btree ("_parent_id");
  CREATE INDEX "about_image_idx" ON "about" USING btree ("image_id");
  CREATE INDEX "support_story_order_idx" ON "support_story" USING btree ("_order");
  CREATE INDEX "support_story_parent_id_idx" ON "support_story" USING btree ("_parent_id");
  CREATE INDEX "support_ways_to_support_paragraphs_order_idx" ON "support_ways_to_support_paragraphs" USING btree ("_order");
  CREATE INDEX "support_ways_to_support_paragraphs_parent_id_idx" ON "support_ways_to_support_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "support_ways_to_support_order_idx" ON "support_ways_to_support" USING btree ("_order");
  CREATE INDEX "support_ways_to_support_parent_id_idx" ON "support_ways_to_support" USING btree ("_parent_id");
  CREATE INDEX "support_thank_you_thank_you_image_idx" ON "support" USING btree ("thank_you_image_id");
  CREATE INDEX "not_found_image_idx" ON "not_found" USING btree ("image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ministers_fk" FOREIGN KEY ("ministers_id") REFERENCES "public"."ministers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_ministers_id_idx" ON "payload_locked_documents_rels" USING btree ("ministers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_members_short_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members_full_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ministers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "support_story" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "support_ways_to_support_paragraphs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "support_ways_to_support" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "support" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "not_found" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "team_members_short_bio" CASCADE;
  DROP TABLE "team_members_full_bio" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "ministers" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "about_paragraphs" CASCADE;
  DROP TABLE "about_features" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "support_story" CASCADE;
  DROP TABLE "support_ways_to_support_paragraphs" CASCADE;
  DROP TABLE "support_ways_to_support" CASCADE;
  DROP TABLE "support" CASCADE;
  DROP TABLE "not_found" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ministers_fk";
  
  DROP INDEX "payload_locked_documents_rels_team_members_id_idx";
  DROP INDEX "payload_locked_documents_rels_ministers_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ministers_id";
  DROP TYPE "public"."enum_about_features_icon";`)
}
