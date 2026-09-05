'use client';

// region Imports

// Import Package
import { z } from 'zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Suspense, useState, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Import Icons
import { Info } from 'lucide-react';

// Import Components
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/common/PageContainer';

// Import Hooks
import { useLogin } from '@/hooks/useLogin';

// Import Constants
import { ROUTES } from '@/constants/routes.constants';

// Import Services
import { ApiError } from '@/services/axios';

// endregion

// Validation schema for the login form's email and password fields
const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_EMAIL = 'demo@1fi.app';
const DEMO_PASSWORD = 'Demo@1234';

// Login route entry point; wraps the form in Suspense since it reads search params
export default function LoginPage(): ReactNode {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}

// Renders the login form and handles credential submission, errors, and post-login redirect
function LoginForm(): ReactNode {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectParam = searchParams.get('redirect');
    const redirectTarget =
        redirectParam && redirectParam.startsWith('/') ? redirectParam : ROUTES.MARKETPLACE;

    // Mutation that authenticates the user with the submitted credentials
    const loginMutation = useLogin();
    const [formError, setFormError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    // Submits the login form and redirects on success, or surfaces field/form errors on failure
    async function onSubmit(values: LoginFormValues): Promise<void> {
        setFormError(null);
        try {
            await loginMutation.mutateAsync(values);
            router.replace(redirectTarget);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.errorCode === 'UNAUTHORIZED') {
                    setFormError('Invalid email or password');
                } else if (error.errorCode === 'VALIDATION_ERROR' && error.errors) {
                    error.errors.forEach((detail) => {
                        if (detail.path === 'email' || detail.path === 'password') {
                            setError(detail.path, { type: 'server', message: detail.message });
                        }
                    });
                    setFormError(error.message);
                } else {
                    setFormError(error.message);
                }
            } else if (error instanceof Error) {
                setFormError(error.message);
            } else {
                setFormError('Something went wrong. Please try again.');
            }
        }
    }

    return (
        <PageContainer size="sm" className="flex min-h-screen flex-col justify-center">
            <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col items-center gap-1 text-center">
                    <Link
                        href={ROUTES.HOME}
                        className="text-2xl font-extrabold tracking-tight text-indigo-600"
                    >
                        1Fi
                    </Link>
                    <h1 className="text-lg font-semibold text-slate-900">Log in to continue</h1>
                    <p className="text-sm text-slate-500">
                        Access EMI-friendly checkout on 1Fi Marketplace
                    </p>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3.5 py-3 text-xs text-indigo-700">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>
                        Demo credentials: <span className="font-semibold">{DEMO_EMAIL}</span> /{' '}
                        <span className="font-semibold">{DEMO_PASSWORD}</span>
                    </p>
                </div>

                {formError ? (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
                    >
                        {formError}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                    <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <Button type="submit" fullWidth isLoading={loginMutation.isPending}>
                        Log in
                    </Button>
                </form>
            </div>
        </PageContainer>
    );
}
