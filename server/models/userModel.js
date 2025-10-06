import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    dateOfBirth: {
        type: Date,
        required: function () {
            // Only require dateOfBirth for new registrations, not for login/password reset
            return this.isNew;
        }
    },
    creditBalance: {
        type: Number,
        default: 5
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    loginCount: {
        type: Number,
        default: 0
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        },
        notifications: {
            email: { type: Boolean, default: true },
            promotions: { type: Boolean, default: true }
        }
    }
}, {
    timestamps: true,
    collection: 'users'
});

// Calculate age from dateOfBirth before saving
userSchema.pre('save', function (next) {
    if (this.dateOfBirth && this.isModified('dateOfBirth')) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        this.age = age;
    }
    next();
});

// Virtual for formatted date of birth
userSchema.virtual('formattedDob').get(function () {
    return this.dateOfBirth ? this.dateOfBirth.toISOString().split('T')[0] : null;
});

// Method to check if user is adult
userSchema.methods.isAdult = function () {
    return this.age >= 18;
};

export default mongoose.model('User', userSchema);