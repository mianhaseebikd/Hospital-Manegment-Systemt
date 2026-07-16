import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true, default: "" },
    description: { type: String, default: "", trim: true },
    icon: { type: String, default: "" },
   isActive: { type: Boolean, default: true },
   isPrimary: { type: Boolean, default: false, index: true }
 },
 { timestamps: true }
);
 
departmentSchema.index({ hospitalId: 1, name: 1 }, { unique: true });
departmentSchema.index({ hospitalId: 1, code: 1 }, { unique: true, sparse: true });

departmentSchema.pre("save", async function () {
 if (!this.code && this.name) {
   this.code = String(this.name)
     .trim()
     .toUpperCase()
     .replace(/[^A-Z0-9]+/g, "-")
     .replace(/^-|-$/g, "")
     .slice(0, 12) || "DEPT";
 }

 // Ensure only one primary department per hospital
 if (this.isPrimary) {
   try {
     await mongoose.model("Department").updateMany({ hospitalId: this.hospitalId, _id: { $ne: this._id } }, { $set: { isPrimary: false } });
   } catch (err) {
     // ignore - let save proceed and validation handle issues
   }
 }
});
 
export const Department = mongoose.model("Department", departmentSchema);
