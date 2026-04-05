import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Table2, Key, GitBranch, Search, Code2, ChevronDown, ChevronRight, Shield, Clock, Zap } from 'lucide-react';

// ─── Static Data ─────────────────────────────────────────────────────────────

const TABLES = [
  {
    name: 'company',
    color: 'blue',
    icon: '🏢',
    description: 'Stores the main company profile data.',
    columns: [
      { name: 'id',               type: 'CHAR(36)',        constraints: 'PK, UUID',       note: 'Generated at app layer' },
      { name: 'name',             type: 'VARCHAR(120)',     constraints: 'NOT NULL' },
      { name: 'description',      type: 'TEXT' },
      { name: 'logo_url',         type: 'VARCHAR(500)' },
      { name: 'phone',            type: 'VARCHAR(30)' },
      { name: 'email',            type: 'VARCHAR(120)' },
      { name: 'address',          type: 'VARCHAR(300)' },
      { name: 'social_facebook',  type: 'VARCHAR(300)' },
      { name: 'social_instagram', type: 'VARCHAR(300)' },
      { name: 'social_whatsapp',  type: 'VARCHAR(300)' },
      { name: 'created_at',       type: 'DATETIME',        constraints: 'NOT NULL',       note: 'Auto timestamp' },
      { name: 'updated_at',       type: 'DATETIME',        constraints: 'NOT NULL',       note: 'Auto on update' },
      { name: 'deleted_at',       type: 'DATETIME',        constraints: 'NULLABLE',       note: 'Soft delete' },
    ],
  },
  {
    name: 'role',
    color: 'purple',
    icon: '🛡️',
    description: 'Lookup table — avoids ENUM migrations.',
    columns: [
      { name: 'id',          type: 'TINYINT UNSIGNED', constraints: 'PK, AI' },
      { name: 'name',        type: 'VARCHAR(40)',      constraints: 'UNIQUE, NOT NULL' },
      { name: 'description', type: 'VARCHAR(200)' },
    ],
  },
  {
    name: 'user',
    color: 'green',
    icon: '👤',
    description: 'Authenticated users with role assignment.',
    columns: [
      { name: 'id',            type: 'CHAR(36)',         constraints: 'PK, UUID' },
      { name: 'company_id',    type: 'CHAR(36)',         constraints: 'FK → company',    note: 'Nullable' },
      { name: 'role_id',       type: 'TINYINT UNSIGNED', constraints: 'FK → role',       note: 'Default: 3 (user)' },
      { name: 'full_name',     type: 'VARCHAR(120)',     constraints: 'NOT NULL' },
      { name: 'email',         type: 'VARCHAR(120)',     constraints: 'UNIQUE, NOT NULL' },
      { name: 'password_hash', type: 'VARCHAR(255)',     constraints: 'NOT NULL',        note: 'bcrypt/argon2' },
      { name: 'phone',         type: 'VARCHAR(30)' },
      { name: 'avatar_url',    type: 'VARCHAR(500)' },
      { name: 'is_active',     type: 'TINYINT(1)',       constraints: 'DEFAULT 1' },
      { name: 'last_login_at', type: 'DATETIME',         constraints: 'NULLABLE' },
      { name: 'created_at',    type: 'DATETIME',         constraints: 'NOT NULL' },
      { name: 'updated_at',    type: 'DATETIME',         constraints: 'NOT NULL' },
      { name: 'deleted_at',    type: 'DATETIME',         constraints: 'NULLABLE' },
    ],
  },
  {
    name: 'category',
    color: 'orange',
    icon: '📂',
    description: 'Service categories — supports filters on the front end.',
    columns: [
      { name: 'id',          type: 'CHAR(36)',    constraints: 'PK, UUID' },
      { name: 'name',        type: 'VARCHAR(80)', constraints: 'UNIQUE, NOT NULL' },
      { name: 'description', type: 'VARCHAR(500)' },
      { name: 'icon',        type: 'VARCHAR(40)', note: 'Lucide icon key' },
      { name: 'sort_order',  type: 'SMALLINT',    constraints: 'DEFAULT 0' },
      { name: 'is_active',   type: 'TINYINT(1)',  constraints: 'DEFAULT 1' },
      { name: 'created_at',  type: 'DATETIME',    constraints: 'NOT NULL' },
      { name: 'updated_at',  type: 'DATETIME',    constraints: 'NOT NULL' },
      { name: 'deleted_at',  type: 'DATETIME',    constraints: 'NULLABLE' },
    ],
  },
  {
    name: 'service',
    color: 'red',
    icon: '🔧',
    description: 'Core service offerings — belongs to company and category.',
    columns: [
      { name: 'id',               type: 'CHAR(36)',    constraints: 'PK, UUID' },
      { name: 'company_id',       type: 'CHAR(36)',    constraints: 'FK → company, NOT NULL' },
      { name: 'category_id',      type: 'CHAR(36)',    constraints: 'FK → category, NULLABLE' },
      { name: 'title',            type: 'VARCHAR(120)', constraints: 'NOT NULL' },
      { name: 'description',      type: 'TEXT',         constraints: 'NOT NULL' },
      { name: 'long_description', type: 'LONGTEXT' },
      { name: 'icon',             type: 'VARCHAR(40)' },
      { name: 'image_url',        type: 'VARCHAR(500)' },
      { name: 'sort_order',       type: 'SMALLINT',    constraints: 'DEFAULT 0' },
      { name: 'is_featured',      type: 'TINYINT(1)',  constraints: 'DEFAULT 0' },
      { name: 'is_active',        type: 'TINYINT(1)',  constraints: 'DEFAULT 1' },
      { name: 'created_at',       type: 'DATETIME',    constraints: 'NOT NULL' },
      { name: 'updated_at',       type: 'DATETIME',    constraints: 'NOT NULL' },
      { name: 'deleted_at',       type: 'DATETIME',    constraints: 'NULLABLE' },
    ],
    indexes: [
      'idx_service_company   (company_id)',
      'idx_service_category  (category_id)',
      'idx_service_featured  (is_featured)',
      'idx_service_order     (sort_order)',
      'ft_service_search     FULLTEXT (title, description)',
    ],
  },
  {
    name: 'service_image',
    color: 'teal',
    icon: '🖼️',
    description: 'Gallery images per service (one-to-many).',
    columns: [
      { name: 'id',         type: 'CHAR(36)',    constraints: 'PK, UUID' },
      { name: 'service_id', type: 'CHAR(36)',    constraints: 'FK → service, CASCADE DELETE' },
      { name: 'url',        type: 'VARCHAR(500)', constraints: 'NOT NULL' },
      { name: 'alt_text',   type: 'VARCHAR(200)' },
      { name: 'sort_order', type: 'SMALLINT',    constraints: 'DEFAULT 0' },
      { name: 'created_at', type: 'DATETIME',    constraints: 'NOT NULL' },
    ],
  },
  {
    name: 'contact_request',
    color: 'yellow',
    icon: '📨',
    description: 'Inbound leads from the contact form.',
    columns: [
      { name: 'id',           type: 'CHAR(36)',    constraints: 'PK, UUID' },
      { name: 'company_id',   type: 'CHAR(36)',    constraints: 'FK → company, NOT NULL' },
      { name: 'service_id',   type: 'CHAR(36)',    constraints: 'FK → service, NULLABLE' },
      { name: 'assigned_to',  type: 'CHAR(36)',    constraints: 'FK → user, NULLABLE' },
      { name: 'name',         type: 'VARCHAR(120)', constraints: 'NOT NULL' },
      { name: 'email',        type: 'VARCHAR(120)', constraints: 'NOT NULL' },
      { name: 'phone',        type: 'VARCHAR(30)' },
      { name: 'company_name', type: 'VARCHAR(120)', note: "Prospect's company" },
      { name: 'message',      type: 'TEXT',         constraints: 'NOT NULL' },
      { name: 'status',       type: "ENUM('new','contacted','in_progress','closed')", constraints: "DEFAULT 'new'" },
      { name: 'notes',        type: 'TEXT',         note: 'Internal notes' },
      { name: 'created_at',   type: 'DATETIME',    constraints: 'NOT NULL' },
      { name: 'updated_at',   type: 'DATETIME',    constraints: 'NOT NULL' },
      { name: 'deleted_at',   type: 'DATETIME',    constraints: 'NULLABLE' },
    ],
  },
  {
    name: 'audit_log',
    color: 'gray',
    icon: '📋',
    description: 'Append-only audit trail. Uses BIGINT AI for performance.',
    columns: [
      { name: 'id',          type: 'BIGINT UNSIGNED', constraints: 'PK, AUTO_INCREMENT', note: 'High-volume, sequential' },
      { name: 'user_id',     type: 'CHAR(36)',         constraints: 'FK → user, NULLABLE' },
      { name: 'action',      type: 'VARCHAR(60)',      constraints: 'NOT NULL',           note: 'e.g. SERVICE_CREATE' },
      { name: 'entity_type', type: 'VARCHAR(60)',      constraints: 'NOT NULL' },
      { name: 'entity_id',   type: 'CHAR(36)' },
      { name: 'payload',     type: 'JSON',             note: 'Before / after snapshot' },
      { name: 'ip_address',  type: 'VARCHAR(45)',      note: 'IPv4 or IPv6' },
      { name: 'created_at',  type: 'DATETIME',         constraints: 'NOT NULL' },
    ],
  },
];

const RELATIONSHIPS = [
  { from: 'company',         to: 'service',         via: 'service.company_id',              type: '1 : N' },
  { from: 'company',         to: 'user',             via: 'user.company_id',                 type: '1 : N' },
  { from: 'company',         to: 'contact_request',  via: 'contact_request.company_id',      type: '1 : N' },
  { from: 'category',        to: 'service',          via: 'service.category_id',             type: '1 : N' },
  { from: 'service',         to: 'service_image',    via: 'service_image.service_id',        type: '1 : N' },
  { from: 'service',         to: 'contact_request',  via: 'contact_request.service_id',      type: '1 : N' },
  { from: 'user',            to: 'contact_request',  via: 'contact_request.assigned_to',     type: '1 : N' },
  { from: 'user',            to: 'audit_log',        via: 'audit_log.user_id',               type: '1 : N' },
  { from: 'role',            to: 'user',             via: 'user.role_id',                    type: '1 : N' },
];

const SQL_SAMPLE = `-- Active services by category
SELECT s.*, c.name AS category_name
FROM service s
LEFT JOIN category c ON s.category_id = c.id
WHERE s.company_id = :companyId
  AND s.deleted_at IS NULL
ORDER BY s.sort_order ASC;

-- Full-text search
SELECT id, title, description
FROM service
WHERE deleted_at IS NULL
  AND MATCH(title, description)
      AGAINST(:query IN NATURAL LANGUAGE MODE);

-- Open contact requests assigned to a rep
SELECT cr.*, s.title AS service_title
FROM contact_request cr
LEFT JOIN service s ON cr.service_id = s.id
WHERE cr.assigned_to = :userId
  AND cr.status IN ('new','contacted','in_progress')
  AND cr.deleted_at IS NULL
ORDER BY cr.created_at DESC;`;

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   badge: 'bg-teal-100 text-teal-700',   dot: 'bg-teal-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  gray:   { bg: 'bg-gray-50',   text: 'text-gray-700',   badge: 'bg-gray-100 text-gray-700',   dot: 'bg-gray-500' },
};

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function TableRow({ table }) {
  const [open, setOpen] = useState(false);
  const c = COLOR_MAP[table.color] || COLOR_MAP.gray;

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{table.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <code className={`text-base font-mono font-bold ${c.text}`}>{table.name}</code>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                {table.columns.length} cols
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{table.description}</p>
          </div>
        </div>
        {open ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${c.bg}`}>
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-44">Column</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Constraints</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {table.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <code className="font-mono text-gray-900 font-semibold">{col.name}</code>
                      </td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-purple-600 text-xs">{col.type}</code>
                      </td>
                      <td className="px-4 py-3 text-xs text-blue-600 font-medium">{col.constraints || '—'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{col.note || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {table.indexes && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Indexes</p>
                  <div className="flex flex-wrap gap-2">
                    {table.indexes.map((idx) => (
                      <code key={idx} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-lg text-gray-600">{idx}</code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DatabaseDocs() {
  const [activeTab, setActiveTab] = useState('tables');

  const tabs = [
    { id: 'tables',    label: 'Tables',        icon: Table2 },
    { id: 'relations', label: 'Relationships',  icon: GitBranch },
    { id: 'indexes',   label: 'Indexes',        icon: Search },
    { id: 'sql',       label: 'SQL Samples',    icon: Code2 },
    { id: 'strategy',  label: 'Strategy',       icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] pt-20">
      {/* Header */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F62FE] rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-[#0F62FE]/20">
              <Database className="w-8 h-8 text-[#0F62FE]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Database Schema</h1>
              <p className="text-white/40 text-sm">MySQL 8.x · ERD · Indexes · SQL</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: '🗄️', label: '8 Tables' },
              { icon: '🔑', label: 'UUID Primary Keys' },
              { icon: '🗑️', label: 'Soft Delete' },
              { icon: '⚡', label: 'Full-text Search' },
              { icon: '📋', label: 'Audit Log' },
            ].map((badge) => (
              <span key={badge.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
                {badge.icon} {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="sticky top-20 z-30 bg-[#0A1628]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0F62FE] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 lg:p-12">
            {activeTab === 'tables' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Table Definitions</h2>
                {TABLES.map((table) => <TableRow key={table.name} table={table} />)}
              </div>
            )}

            {activeTab === 'relations' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Table Relationships</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Parent Table</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Child Table</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Via (FK Column)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {RELATIONSHIPS.map((rel, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-3 px-4"><code className="font-mono font-semibold text-blue-600">{rel.from}</code></td>
                          <td className="py-3 px-4"><span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">{rel.type}</span></td>
                          <td className="py-3 px-4"><code className="font-mono font-semibold text-green-600">{rel.to}</code></td>
                          <td className="py-3 px-4"><code className="font-mono text-gray-500 text-xs">{rel.via}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ERD ASCII art */}
                <div className="mt-10 p-6 bg-gray-900 rounded-2xl overflow-x-auto">
                  <pre className="text-green-400 text-xs leading-relaxed font-mono whitespace-pre">{`
company ──1:N──► service ──1:N──► service_image
   │                │
   │                └──1:N──► contact_request ◄──N:1── user ◄──N:1── role
   │                                                        │
   └──1:N──► user                                           └──1:N──► audit_log
   │
   └──1:N──► contact_request

category ──1:N──► service
`}</pre>
                </div>
              </div>
            )}

            {activeTab === 'indexes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Indexing Strategy</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    { table: 'user',            indexes: [{ name: 'email', type: 'UNIQUE', reason: 'Authentication lookup' }, { name: 'company_id', type: 'BTREE', reason: 'FK join performance' }, { name: 'deleted_at', type: 'BTREE', reason: 'Soft-delete filter' }] },
                    { table: 'service',         indexes: [{ name: 'company_id', type: 'BTREE', reason: 'Tenant isolation filter' }, { name: 'category_id', type: 'BTREE', reason: 'Category drill-down' }, { name: 'is_featured', type: 'BTREE', reason: 'Featured list query' }, { name: 'sort_order', type: 'BTREE', reason: 'ORDER BY performance' }, { name: 'title + description', type: 'FULLTEXT', reason: 'Search without Elasticsearch' }] },
                    { table: 'contact_request', indexes: [{ name: 'status', type: 'BTREE', reason: 'CRM pipeline filter' }, { name: 'service_id', type: 'BTREE', reason: 'Service-level leads' }, { name: 'company_id', type: 'BTREE', reason: 'Tenant isolation' }] },
                    { table: 'audit_log',       indexes: [{ name: 'entity_type + entity_id', type: 'COMPOSITE', reason: 'History for any entity' }, { name: 'user_id', type: 'BTREE', reason: 'User activity timeline' }, { name: 'created_at', type: 'BTREE', reason: 'Time-range queries' }] },
                  ].map((section) => (
                    <div key={section.table} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                        <code className="font-mono font-bold text-gray-800">{section.table}</code>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {section.indexes.map((idx) => (
                          <div key={idx.name} className="px-5 py-3 flex items-start gap-3">
                            <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-blue-50 text-blue-600 whitespace-nowrap mt-0.5">{idx.type}</span>
                            <div>
                              <code className="text-sm font-mono text-gray-700">{idx.name}</code>
                              <p className="text-xs text-gray-400 mt-0.5">{idx.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sql' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Sample Queries</h2>
                <div className="bg-gray-900 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-white/30 text-xs">schema.sql</span>
                  </div>
                  <pre className="p-6 text-sm text-green-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">{SQL_SAMPLE}</pre>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Design Strategy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: Key, title: 'UUID Primary Keys', color: 'blue', points: ['CHAR(36) on all user tables', 'Generated at application layer', 'No sequential ID leakage', 'Works across distributed services'] },
                    { icon: Clock, title: 'Audit Timestamps', color: 'green', points: ['created_at on every table', 'updated_at with ON UPDATE', 'deleted_at for soft delete', 'No hard deletes on mutable data'] },
                    { icon: Shield, title: 'Soft Delete', color: 'purple', points: ['deleted_at IS NULL = active', 'Recoverable accidental deletes', 'Full audit trail preserved', 'Indexed for query performance'] },
                    { icon: Zap, title: 'Performance', color: 'orange', points: ['BTREE indexes on all FK cols', 'FULLTEXT on service search', 'BIGINT AI for audit_log PK', 'Composite index on audit_log'] },
                  ].map((card) => (
                    <div key={card.title} className="border border-gray-100 rounded-2xl p-6">
                      <div className={`w-11 h-11 rounded-xl bg-${card.color}-50 flex items-center justify-center mb-4`}>
                        <card.icon className={`w-5 h-5 text-${card.color}-600`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{card.title}</h3>
                      <ul className="space-y-2">
                        {card.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-sm text-gray-500">
                            <span className="text-[#0F62FE] mt-1">›</span> {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Naming conventions */}
                <div className="mt-8 border border-gray-100 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Naming Conventions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[
                      ['Tables', 'Singular snake_case — service, contact_request'],
                      ['Columns', 'snake_case — full_name, created_at'],
                      ['PK constraint', 'pk_<table> — pk_service'],
                      ['FK constraint', 'fk_<table>_<ref> — fk_service_company'],
                      ['Unique constraint', 'uq_<table>_<col> — uq_user_email'],
                      ['Index', 'idx_<table>_<col> — idx_service_category'],
                      ['Full-text', 'ft_<table>_<purpose> — ft_service_search'],
                    ].map(([label, example]) => (
                      <div key={label} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="font-semibold text-gray-700 whitespace-nowrap">{label}:</span>
                        <code className="text-gray-500 text-xs font-mono">{example}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}