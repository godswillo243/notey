import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from './ui/input'
import { useState } from 'react'
import type { HTMLInputTypeAttribute } from 'react'
import { Button } from './ui/button'
import { EyeIcon } from 'lucide-react'

interface FormFieldProps {
  field: AnyFieldApi
  label: string
  type?: HTMLInputTypeAttribute
}

const FormField = ({ field, label, type = 'text' }: FormFieldProps) => {
  const { state } = field
  const errorMessage = state.meta.errors[0]?.message
  const [showPassword, setShowPassword] = useState(false)
  return (
    <>
      <div className="flex flex-col justify-center gap-2">
        <label htmlFor={field.name} className="font-medium s">
          {label}:
        </label>
        <div className="w-full relative">
          <Input
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            type={
              type === 'password' ? (showPassword ? 'text' : 'password') : type
            }
            onChange={(e) => field.handleChange(e.target.value)}
          />
          {type === 'password' && (
            <Button
              variant={'ghost'}
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-0"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon />
            </Button>
          )}
        </div>
        {errorMessage && (
          <p className="text-sm text-destructive-foreground font-medium p-2">
            {errorMessage}
          </p>
        )}
      </div>
    </>
  )
}

export default FormField
