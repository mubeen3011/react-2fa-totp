var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => TwoFactorAuth
});
module.exports = __toCommonJS(index_exports);
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function apiFetch(endpoint, body) {
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(__spreadValues({ format: "json" }, body))
  }).then((r) => r.json());
}
function TwoFactorAuth({ apiEndpoint, onEnabled, onDisabled, onError }) {
  const [step, setStep] = (0, import_react.useState)("idle");
  const [qrCode, setQrCode] = (0, import_react.useState)("");
  const [secret, setSecret] = (0, import_react.useState)("");
  const [code, setCode] = (0, import_react.useState)("");
  const [enabled, setEnabled] = (0, import_react.useState)(false);
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [statusLoading, setStatusLoading] = (0, import_react.useState)(true);
  const [backupCode, setBackupCode] = (0, import_react.useState)("");
  const [copied, setCopied] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  (0, import_react.useEffect)(() => {
    apiFetch(apiEndpoint, { method: "get_2fa_status" }).then((d) => {
      var _a, _b;
      if (!(d == null ? void 0 : d.error)) setEnabled((_b = (_a = d == null ? void 0 : d.data) == null ? void 0 : _a.enabled) != null ? _b : false);
      setStatusLoading(false);
    });
  }, []);
  const generateQR = async () => {
    var _a;
    setLoading(true);
    const d = await apiFetch(apiEndpoint, { method: "generate_2fa_secret" });
    if (!(d == null ? void 0 : d.error) && ((_a = d == null ? void 0 : d.data) == null ? void 0 : _a.qr_code)) {
      setQrCode(d.data.qr_code);
      setSecret(d.data.secret);
      setStep("setup");
    } else {
      onError == null ? void 0 : onError("Failed to generate QR code");
    }
    setLoading(false);
  };
  const verifyCode = async () => {
    var _a;
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    const d = await apiFetch(apiEndpoint, { method: "verify_2fa_code", code, secret });
    if (!(d == null ? void 0 : d.error)) {
      const bc = await apiFetch(apiEndpoint, { method: "generate_backup_codes" });
      setEnabled(true);
      setCode("");
      if (!(bc == null ? void 0 : bc.error) && ((_a = bc == null ? void 0 : bc.data) == null ? void 0 : _a.codes)) {
        setBackupCode(bc.data.codes[0]);
        setStep("backup");
      } else {
        setStep("idle");
        onEnabled == null ? void 0 : onEnabled();
      }
    } else {
      setError("Invalid code. Please check your authenticator app.");
    }
    setLoading(false);
  };
  const disable2FA = async () => {
    if (!window.confirm("Are you sure you want to disable 2FA?")) return;
    setLoading(true);
    const d = await apiFetch(apiEndpoint, { method: "disable_2fa" });
    if (!(d == null ? void 0 : d.error)) {
      setEnabled(false);
      onDisabled == null ? void 0 : onDisabled();
    } else {
      onError == null ? void 0 : onError("Failed to disable 2FA");
    }
    setLoading(false);
  };
  const copy = () => {
    navigator.clipboard.writeText(backupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  if (statusLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#888" }, children: "Loading..." });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { padding: "24px", border: "1px solid #eee", borderRadius: "8px", maxWidth: "480px" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }, children: "Two-Factor Authentication" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "14px", color: "#666", marginBottom: "20px" }, children: "Secure your account with Google Authenticator or any TOTP app." }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontSize: "14px" }, children: "Status:" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "bold",
        background: enabled ? "#d1fae5" : "#fee2e2",
        color: enabled ? "#065f46" : "#991b1b"
      }, children: enabled ? "ENABLED" : "DISABLED" }),
      enabled && step === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: disable2FA,
          disabled: loading,
          style: { marginLeft: "auto", padding: "6px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
          children: loading ? "Removing..." : "Remove 2FA"
        }
      )
    ] }),
    step === "idle" && !enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        onClick: generateQR,
        disabled: loading,
        style: { padding: "8px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
        children: loading ? "Loading..." : "Setup Authenticator"
      }
    ),
    step === "setup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "14px", marginBottom: "8px" }, children: "1. Install Google Authenticator or any TOTP app" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "14px", marginBottom: "12px" }, children: "2. Scan this QR code:" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: qrCode, alt: "QR Code", style: { width: "180px", height: "180px", marginBottom: "12px" } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { fontSize: "12px", color: "#888", marginBottom: "16px" }, children: [
        "Manual code: ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { style: { background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }, children: secret })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "14px", marginBottom: "8px" }, children: "3. Enter the 6-digit code:" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "text",
            maxLength: 6,
            placeholder: "000000",
            value: code,
            onChange: (e) => setCode(e.target.value.replace(/\D/g, "")),
            style: { width: "120px", textAlign: "center", fontSize: "18px", letterSpacing: "6px", padding: "8px", border: "1px solid #d1d5db", borderRadius: "6px" },
            autoFocus: true
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: verifyCode,
            disabled: loading || code.length !== 6,
            style: { padding: "8px 18px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
            children: loading ? "Verifying..." : "Verify & Enable"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: () => {
              setStep("idle");
              setCode("");
            },
            style: { padding: "8px 18px", background: "#fff", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "6px", cursor: "pointer" },
            children: "Cancel"
          }
        )
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#ef4444", fontSize: "13px", marginTop: "8px" }, children: error })
    ] }),
    step === "backup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "14px", fontWeight: "bold", color: "#065f46", marginBottom: "8px" }, children: "\u2705 2FA Enabled! Save Your Backup Code" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: "13px", color: "#666", marginBottom: "12px" }, children: "Use this code if you lose access to your authenticator app. Works until 2FA is disabled." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "12px", background: "#f9fafb", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { fontFamily: "monospace", fontSize: "20px", fontWeight: "bold", letterSpacing: "4px" }, children: backupCode }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            onClick: copy,
            style: { marginLeft: "auto", padding: "6px 14px", background: "#fff", border: "1px solid #4f46e5", color: "#4f46e5", borderRadius: "6px", cursor: "pointer" },
            children: copied ? "Copied!" : "Copy"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          onClick: () => setStep("idle"),
          style: { padding: "8px 18px", background: "#10b981", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
          children: "Done"
        }
      )
    ] })
  ] });
}
