import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Phone, MapPin, Mail, Lock } from 'lucide-react';
import { setAuthHeader } from '../../utils/auth';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setAuthHeader(axios); // Set auth header
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5432/api/users/profile');
            setUser(response.data);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                address: response.data.address || ''
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Error fetching profile');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:5432/api/users/profile', formData);
            setUser(response.data);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        try {
            await axios.put('http://localhost:5432/api/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error changing password');
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                {!isEditing ? (
                    // View Mode
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <User className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-lg">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Mail className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Phone className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-lg">{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <MapPin className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-lg">{user.address || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    Change Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
