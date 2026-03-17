-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'sales',
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "advertiser_id" TEXT,
    "restaurant_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "details" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "stage" TEXT NOT NULL DEFAULT 'lead',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "estimated_value" DOUBLE PRECISION,
    "assigned_to_id" TEXT,
    "created_by_id" TEXT NOT NULL,
    "advertiser_id" TEXT,
    "restaurant_id" TEXT,
    "suburb" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Brisbane',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "lead_id" TEXT,
    "advertiser_id" TEXT,
    "campaign_id" TEXT,
    "restaurant_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisers" (
    "id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "target_suburbs" TEXT NOT NULL DEFAULT '[]',
    "target_postcodes" TEXT NOT NULL DEFAULT '[]',
    "target_radius_km" DOUBLE PRECISION,
    "target_lat" DOUBLE PRECISION,
    "target_lng" DOUBLE PRECISION,
    "target_audience" TEXT,
    "campaign_goal" TEXT NOT NULL DEFAULT 'brand_awareness',
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Brisbane',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cafes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Brisbane',
    "state" TEXT NOT NULL DEFAULT 'QLD',
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "cuisine_type" TEXT,
    "avg_daily_foot_traffic" INTEGER NOT NULL DEFAULT 0,
    "avg_daily_orders" INTEGER NOT NULL DEFAULT 0,
    "packaging_volume" INTEGER NOT NULL DEFAULT 0,
    "demographics" TEXT,
    "operating_hours" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "partner_since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cafes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "advertiser_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "target_suburbs" TEXT NOT NULL DEFAULT '[]',
    "target_postcodes" TEXT NOT NULL DEFAULT '[]',
    "target_radius_km" DOUBLE PRECISION,
    "packaging_quantity" INTEGER NOT NULL DEFAULT 0,
    "packaging_type" TEXT,
    "ad_format" TEXT,
    "target_demographic" TEXT,
    "budget" DOUBLE PRECISION,
    "total_impressions" INTEGER NOT NULL DEFAULT 0,
    "estimated_impressions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placements" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "cafe_id" TEXT NOT NULL,
    "match_score" DOUBLE PRECISION NOT NULL,
    "match_reason" TEXT NOT NULL,
    "score_breakdown" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "estimated_daily_impressions" INTEGER NOT NULL DEFAULT 0,
    "actual_impressions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packaging_batches" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "packaging_type" TEXT NOT NULL,
    "quantity_produced" INTEGER NOT NULL DEFAULT 0,
    "quantity_shipped" INTEGER NOT NULL DEFAULT 0,
    "production_date" TIMESTAMP(3),
    "estimated_ready" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ordered',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packaging_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packaging_inventory" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "cafe_id" TEXT NOT NULL,
    "quantity_allocated" INTEGER NOT NULL DEFAULT 0,
    "quantity_used" INTEGER NOT NULL DEFAULT 0,
    "quantity_remaining" INTEGER NOT NULL DEFAULT 0,
    "last_restock_date" TIMESTAMP(3),
    "estimated_runout" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packaging_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_reports" (
    "id" TEXT NOT NULL,
    "cafe_id" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "packaging_used" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "storage_path" TEXT NOT NULL,
    "advertiser_id" TEXT,
    "campaign_id" TEXT,
    "uploaded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "campaign_id" TEXT,
    "cafe_id" TEXT,
    "placement_id" TEXT,
    "advertiser_id" TEXT,
    "batch_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_scans" (
    "id" TEXT NOT NULL,
    "qr_code_id" TEXT NOT NULL,
    "device_type" TEXT,
    "os" TEXT,
    "browser" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "scan_lat" DOUBLE PRECISION,
    "scan_lng" DOUBLE PRECISION,
    "scan_suburb" TEXT,
    "session_id" TEXT,
    "referrer" TEXT,
    "redirected" BOOLEAN NOT NULL DEFAULT true,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "campaign_id" TEXT,
    "cafe_id" TEXT,
    "suburb" TEXT,
    "postcode" TEXT,
    "metadata" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suburb_data" (
    "id" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Brisbane',
    "state" TEXT NOT NULL DEFAULT 'QLD',
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "population" INTEGER,
    "median_age" INTEGER,
    "median_income" INTEGER,
    "primary_demographic" TEXT,
    "trending_interests" TEXT NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suburb_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_idx" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "leads_assigned_to_id_idx" ON "leads"("assigned_to_id");

-- CreateIndex
CREATE INDEX "leads_stage_idx" ON "leads"("stage");

-- CreateIndex
CREATE INDEX "leads_type_idx" ON "leads"("type");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "activities_lead_id_idx" ON "activities"("lead_id");

-- CreateIndex
CREATE INDEX "activities_advertiser_id_idx" ON "activities"("advertiser_id");

-- CreateIndex
CREATE INDEX "activities_campaign_id_idx" ON "activities"("campaign_id");

-- CreateIndex
CREATE INDEX "activities_created_at_idx" ON "activities"("created_at");

-- CreateIndex
CREATE INDEX "cafes_suburb_idx" ON "cafes"("suburb");

-- CreateIndex
CREATE INDEX "cafes_postcode_idx" ON "cafes"("postcode");

-- CreateIndex
CREATE INDEX "cafes_city_idx" ON "cafes"("city");

-- CreateIndex
CREATE INDEX "campaigns_advertiser_id_idx" ON "campaigns"("advertiser_id");

-- CreateIndex
CREATE INDEX "campaigns_status_idx" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "placements_campaign_id_idx" ON "placements"("campaign_id");

-- CreateIndex
CREATE INDEX "placements_cafe_id_idx" ON "placements"("cafe_id");

-- CreateIndex
CREATE INDEX "placements_status_idx" ON "placements"("status");

-- CreateIndex
CREATE UNIQUE INDEX "placements_campaign_id_cafe_id_key" ON "placements"("campaign_id", "cafe_id");

-- CreateIndex
CREATE INDEX "packaging_batches_campaign_id_idx" ON "packaging_batches"("campaign_id");

-- CreateIndex
CREATE INDEX "packaging_batches_status_idx" ON "packaging_batches"("status");

-- CreateIndex
CREATE INDEX "packaging_inventory_cafe_id_idx" ON "packaging_inventory"("cafe_id");

-- CreateIndex
CREATE UNIQUE INDEX "packaging_inventory_batch_id_cafe_id_key" ON "packaging_inventory"("batch_id", "cafe_id");

-- CreateIndex
CREATE INDEX "usage_reports_cafe_id_idx" ON "usage_reports"("cafe_id");

-- CreateIndex
CREATE INDEX "usage_reports_report_date_idx" ON "usage_reports"("report_date");

-- CreateIndex
CREATE INDEX "assets_advertiser_id_idx" ON "assets"("advertiser_id");

-- CreateIndex
CREATE INDEX "assets_campaign_id_idx" ON "assets"("campaign_id");

-- CreateIndex
CREATE INDEX "assets_file_type_idx" ON "assets"("file_type");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_code_key" ON "qr_codes"("code");

-- CreateIndex
CREATE INDEX "qr_codes_code_idx" ON "qr_codes"("code");

-- CreateIndex
CREATE INDEX "qr_codes_campaign_id_idx" ON "qr_codes"("campaign_id");

-- CreateIndex
CREATE INDEX "qr_codes_cafe_id_idx" ON "qr_codes"("cafe_id");

-- CreateIndex
CREATE INDEX "qr_codes_advertiser_id_idx" ON "qr_codes"("advertiser_id");

-- CreateIndex
CREATE INDEX "qr_scans_qr_code_id_idx" ON "qr_scans"("qr_code_id");

-- CreateIndex
CREATE INDEX "qr_scans_scanned_at_idx" ON "qr_scans"("scanned_at");

-- CreateIndex
CREATE INDEX "qr_scans_scan_suburb_idx" ON "qr_scans"("scan_suburb");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE INDEX "analytics_events_campaign_id_idx" ON "analytics_events"("campaign_id");

-- CreateIndex
CREATE INDEX "analytics_events_cafe_id_idx" ON "analytics_events"("cafe_id");

-- CreateIndex
CREATE INDEX "analytics_events_occurred_at_idx" ON "analytics_events"("occurred_at");

-- CreateIndex
CREATE UNIQUE INDEX "suburb_data_suburb_key" ON "suburb_data"("suburb");

-- CreateIndex
CREATE INDEX "suburb_data_postcode_idx" ON "suburb_data"("postcode");

-- CreateIndex
CREATE INDEX "suburb_data_city_idx" ON "suburb_data"("city");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "cafes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "cafes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_batches" ADD CONSTRAINT "packaging_batches_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_inventory" ADD CONSTRAINT "packaging_inventory_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "packaging_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packaging_inventory" ADD CONSTRAINT "packaging_inventory_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_reports" ADD CONSTRAINT "usage_reports_cafe_id_fkey" FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "advertisers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
