import { pgTable, text, timestamp, integer, jsonb, boolean, uuid } from 'drizzle-orm/pg-core';

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  scriptText: text('script_text').notNull(),
  status: text('status').notNull().default('draft'), // draft | processing | completed | error
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Render jobs table
export const renderJobs = pgTable('render_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  status: text('status').notNull().default('queued'), // queued | running | completed | error
  step: text('step').notNull().default('audio_assembly'), // audio_assembly | alignment | clip_matching | render_plan
  timelineJson: jsonb('timeline_json'), // The final timeline plan
  chapterTimingMap: jsonb('chapter_timing_map'), // { chapter: 1, start: 0, end: 12.4 }[]
  beatAlignments: jsonb('beat_alignments'), // WhisperX word-level output
  errorMessage: text('error_message'),
  outputPath: text('output_path'), // local path to rendered MP4
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Clips library table - metadata for user's pre-cut clips
export const clips = pgTable('clips', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  filename: text('filename').notNull(),
  localPath: text('local_path').notNull(),
  tags: text('tags').array(), // extra tags user adds
  durationSeconds: integer('duration_seconds'),
  isUsed: boolean('is_used').default(false),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Timeline beats table - each ~5s beat in the script
export const beats = pgTable('beats', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => renderJobs.id).notNull(),
  chapterIndex: integer('chapter_index').notNull(),
  beatIndex: integer('beat_index').notNull(),
  text: text('text').notNull(),
  startTime: integer('start_time'), // ms
  endTime: integer('end_time'), // ms
  matchedClipId: uuid('matched_clip_id'), // null if stock footage
  matchedClipPath: text('matched_clip_path'),
  stockSource: text('stock_source'), // 'pexels' | 'pixabay' | 'coverr' | 'mixkit' | 'archive'
  stockUrl: text('stock_url'),
  hasNumberOverlay: boolean('has_number_overlay').default(false),
  overlayText: text('overlay_text'), // e.g. "$2,000"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type RenderJob = typeof renderJobs.$inferSelect;
export type NewRenderJob = typeof renderJobs.$inferInsert;
export type Clip = typeof clips.$inferSelect;
export type NewClip = typeof clips.$inferInsert;
export type Beat = typeof beats.$inferSelect;
export type NewBeat = typeof beats.$inferInsert;
