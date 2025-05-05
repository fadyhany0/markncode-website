"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAdminRole = exports.setAdminRole = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
exports.setAdminRole = functions.https.onCall(async (data, context) => {
    var _a;
    // Check if the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Check if the user is already an admin
    const user = await admin.auth().getUser(context.auth.uid);
    if (!((_a = user.customClaims) === null || _a === void 0 ? void 0 : _a.admin)) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can set admin roles.');
    }
    try {
        // Set admin custom claim
        await admin.auth().setCustomUserClaims(data.uid, {
            admin: true,
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error setting admin role:', error);
        throw new functions.https.HttpsError('internal', 'Error setting admin role.');
    }
});
exports.removeAdminRole = functions.https.onCall(async (data, context) => {
    var _a;
    // Check if the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    // Check if the user is an admin
    const user = await admin.auth().getUser(context.auth.uid);
    if (!((_a = user.customClaims) === null || _a === void 0 ? void 0 : _a.admin)) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can remove admin roles.');
    }
    try {
        // Remove admin custom claim
        await admin.auth().setCustomUserClaims(data.uid, {
            admin: false,
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error removing admin role:', error);
        throw new functions.https.HttpsError('internal', 'Error removing admin role.');
    }
});
//# sourceMappingURL=index.js.map