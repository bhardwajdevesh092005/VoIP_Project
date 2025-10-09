import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const onSubmit = data => {
        console.log(data)
    }
    return (
        <div className="h-full flex flex-col items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                        <img src="/Logo.png" alt="" className="h-[80px] w-[80px]" />
                    </div>
                    <h1 className="text-3xl font-bold ml-4">SignUp</h1>
                </div>
                <form className="space-y-4 text-left" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="bg-transparent w-full outline-none"
                                {...register('fullName', { required: 'Full name is required' })}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type="text"
                                placeholder="Email"
                                className="bg-transparent w-full outline-none"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email format',
                                    },
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Phone</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type="text"
                                placeholder="Phone"
                                className="bg-transparent w-full outline-none"
                                {...register('phone', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: 'Invalid phone number',
                                    },
                                })}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="bg-transparent w-full outline-none"
                                {...register('password', { required: 'Password is required' })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="text-gray-500 focus:outline-none ml-2"
                            >
                                {showPassword ? (
                                    <img className="w-7 h-7" src="eye-close.svg" />
                                ) : (
                                    <img className="w-7 h-7" src="/eye-open.svg" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Confirm Password</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                className="bg-transparent w-full outline-none"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="text-gray-500 focus:outline-none ml-2"
                            >
                                {showConfirmPassword ? (
                                    <img className="w-7 h-7" src="eye-close.svg" />
                                ) : (
                                    <img className="w-7 h-7" src="/eye-open.svg" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Sign Up
                    </button>

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-400 text-sm">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <div className="mt-4 text-sm text-center">
                        Already have an account?{' '}
                        <Link to={'/login'} className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
