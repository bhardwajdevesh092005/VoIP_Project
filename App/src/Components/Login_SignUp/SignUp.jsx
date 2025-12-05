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
        <div className="h-full flex flex-col items-center justify-center px-4 py-8">
            <div className="card p-8 md:p-10 w-full max-w-md">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="mb-4">
                        <img src="/Logo.png" alt="" className="h-[60px] w-[200px] object-cover" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Join us and start calling today
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="input-field"
                            {...register('fullName', { required: 'Full name is required' })}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            className="input-field"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email format',
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Phone
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            className="input-field"
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'Invalid phone number',
                                },
                            })}
                        />
                        {errors.phone && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className="input-field pr-12"
                                {...register('password', { required: 'Password is required' })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                {showPassword ? (
                                    <img className="w-6 h-6" src="eye-close.svg" alt="Hide" />
                                ) : (
                                    <img className="w-6 h-6" src="/eye-open.svg" alt="Show" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="input-field pr-12"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <img className="w-6 h-6" src="eye-close.svg" alt="Hide" />
                                ) : (
                                    <img className="w-6 h-6" src="/eye-open.svg" alt="Show" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="btn-secondary w-full text-base mt-6">
                        Sign Up
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 ml-2 inline-block"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>

                    <div className="flex items-center my-5">
                        <hr className="flex-grow border-gray-300 dark:border-dark-600" />
                        <span className="mx-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
                            OR
                        </span>
                        <hr className="flex-grow border-gray-300 dark:border-dark-600" />
                    </div>

                    <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link
                            to={'/login'}
                            className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 font-semibold transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
