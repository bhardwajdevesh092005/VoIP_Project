import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()
    const onSubmit = data => {
        console.log(data)
    }
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }
    return (
        <div className="h-full flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                        <img src="/Logo.png" alt="" className="h-[80px] w-[80px]" />
                    </div>
                    <h1 className="text-3xl font-bold ml-4">Login</h1>
                </div>
                <form className="space-y-4 text-left" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm mb-1">Email / Phone</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type="text"
                                placeholder="Email / Phone"
                                className="bg-transparent w-full outline-none"
                                {...register('emailOrPhone', {
                                    required: 'Email or phone is required',
                                })}
                            />
                        </div>
                        {errors.emailOrPhone && (
                            <p className="text-red-500 text-sm">{errors.emailOrPhone.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                            <input
                                type={!showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="bg-transparent w-full outline-none"
                                {...register('password', { required: 'Password is required' })}
                            />
                            <span
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="text-gray-500 focus:outline-none ml-2 relative right-0"
                            >
                                {showPassword ? (
                                    <img className="w-7 h-7" src="eye-close.svg" />
                                ) : (
                                    <img className="w-7 h-7" src="/eye-open.svg" />
                                )}
                            </span>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Login
                    </button>

                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-400 text-sm">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    <button
                        type="button"
                        className="flex items-center justify-center w-full py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition"
                    >
                        <img src="/google.webp" alt="Google" className="w-8 h-8 -p-2" />
                        Continue with Google
                    </button>

                    <div className="mt-4 text-sm text-center">
                        Don't have an account?{' '}
                        <Link to={'/sign-up'} className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
