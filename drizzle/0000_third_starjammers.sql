CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pid" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"user_id" uuid NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "plants_pid_unique" UNIQUE("pid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_plants_pid" ON "plants" USING btree ("pid");--> statement-breakpoint
CREATE INDEX "idx_plants_user_id" ON "plants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_plants_created_at" ON "plants" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_plants_name" ON "plants" USING btree ("name");