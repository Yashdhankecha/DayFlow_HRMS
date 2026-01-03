const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    details: String,
    ipAddress: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
