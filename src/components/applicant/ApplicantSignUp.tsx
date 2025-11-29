'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import PersonalInfoStep from './PersonalInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicantFormType, applicantSchema } from '@/validations/applicantSchema';
import { EmailCodeValidationStep } from '../auth/EmailCodeValidationStep';

export default function ApplicantSignUp() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ApplicantFormType>({
    resolver: zodResolver(applicantSchema),
    defaultValues: {
      name: '', lastName: '', address: '', birthDate: '', email: '',
      password: '', confirmPassword: '', telefono: '', telefonoCode: '+52',
      career: '', professionalSummary: '', jobLocationPreference: '',
      preferredHours: '', employmentMode: '', profilePhoto: null, cvFile: undefined,
    },
    mode: 'onSubmit',
    shouldUnregister: false 
  });

  const { control, handleSubmit, trigger, getValues, watch } = methods;

  const handleStepOneSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    
    console.log("1. Iniciando validación...");
    
    const isValid = await trigger([
      'name', 'lastName', 'address', 'birthDate',
      'email', 'telefono', 'password', 'confirmPassword'
    ]);

    if (!isValid) {
      console.log("trono");
      return; 
    }

    console.log("NOtrono.");
    setIsLoading(true);

    try {
      const dataStep1 = getValues();
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      console.log("Supongamos que funciono ");
      
      setStep(2); 
      
    } catch (error) {
      console.error("NO funciono mamu el error es:", error);
      alert("Hubo un error al guardar tus datos. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerified = async (code: string) => {
    setIsLoading(true);
    try {
      const email = getValues('email');
      console.log(`SUpongamosqueverifico el codigo que es  ${code} para ${email}`);
      
      setStep(3);
    } catch (error) {
      console.error('Código inválido', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (data: ApplicantFormType) => {
    setIsLoading(true);
    try {
      console.log('Enviando Endpoint 3 :', data);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl rounded-lg border border-zinc-200 bg-white p-12 shadow-sm">
      <div className="mb-8 space-y-8 text-center">
        <h1 className="text-3xl font-bold text-brand">Completa tu registro</h1>
        <h2 className="mx-auto max-w-2xl text-lg text-gray-600">
          {step === 2 
            ? "Verifica tu identidad" 
            : "Rellena los campos para completar tu registro y acceder a la plataforma"}
        </h2>
      </div>

      <FormProvider {...methods}>
        
        {step === 1 && (
          <form className="mt-8 space-y-6">
            <PersonalInfoStep control={control} />
            
            <div className="flex justify-center">
              <Button 
                type="button" 
                onClick={handleStepOneSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Cargando next step' : 'Continuar'}
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8">
            <EmailCodeValidationStep
              email={watch('email')}
              onVerified={handleCodeVerified}
              onBack={() => setStep(1)}
              onResend={() => console.log('Reenviando código...')}
            />
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit(handleFinalSubmit)} className="mt-8 space-y-6">
            <ProfessionalInfoStep control={control} />

            <div className="flex justify-center">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Finalizando...' : 'Finalizar registro'}
              </Button>
            </div>
          </form>
        )}

      </FormProvider>
    </div>
  );
}