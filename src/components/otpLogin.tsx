import * as React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material'
import { styled } from '@mui/system'
import OtpInput from './lib/otpInput'
import { auth, firebase } from '../auth/firebase'

const NumberField = styled(TextField)({
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
})

export default function MediaCard() {
  const countryCodes = [
    {
      value: '+91',
      label: '🇮🇳 +91',
    },
  ]
  const [countryCode, setCountryCode] = React.useState('+91')
  const [phoneNo, setPhoneNo] = React.useState("")
  const [isOtpSent, setIsOtpSent] = React.useState(false)
  const [showCaptcha, setShowCaptcha] = React.useState(false)
  const [authContext, setAuthContext] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [otpVerifyErr, setOtpVerifyErr] = React.useState(' ');

  const signin = () => {
    if (phoneNoError) return
    setLoading(true);
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
      },
    )
    auth
      .signInWithPhoneNumber('+91' + phoneNo, recaptchaVerifier)
      .then((result) => {
        setAuthContext(result)
        setIsOtpSent(true)
        setShowCaptcha(true)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)

        setShowCaptcha(true)
        setShowCaptcha(false)
        setLoading(false)
      })
  }

  const ValidateOtp = (otp) => {
    if (!authContext || !otp) return;
    setLoading(true);
    authContext
      .confirm(otp)
      .then((result) => {
        console.log('res', result)
        setLoading(false);
      })
      .catch((err) => {
        setOtpVerifyErr('Invalid code')
        console.log('Wrong code', err)
        setLoading(false);
      })
  }

  const handleChange = (event) => {
    setCountryCode(event.target.value)
  }

  const [otp, setOtp] = React.useState('')
  const [phoneNoError, setPhoneNoError] = React.useState(false)

  const handlePhoneChange = (e) => {
    if (e.target.value.length > 10) return false
    if (e.target.value.length !== 10) {
      if (e.target.value.length === 0) {
        setPhoneNoError(false)
      } else {
        setPhoneNoError(true)
      }
    } else {
      setPhoneNoError(false)
    }
    setPhoneNo(e.target.value)
  }

  const isDisabled = () => {
    if (phoneNoError || !phoneNo || loading) {
      return true
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        height: '70vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography
            sx={{ textAlign: 'center' }}
            gutterBottom
            variant="h6"
            component="div"
          >
            {!isOtpSent
              ? 'Enter your phone number'
              : 'Verify your phone number'}
          </Typography>
          {isOtpSent && (
            <Typography
              sx={{ textAlign: 'center', fontSize: 14 }}
              gutterBottom
              component="div"
            >
              {'Enter the 6-digit code we sent to your mobile'}
            </Typography>
          )}
          {!isOtpSent ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <TextField
                id="standard-select-countryCode"
                select
                label=" "
                value={countryCode}
                onChange={handleChange}
                variant="standard"
              >
                {countryCodes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <NumberField
                style={{ marginLeft: 10 }}
                type="number"
                id="standard-basic"
                label="Phone number"
                variant="standard"
                value={phoneNo}
                onChange={handlePhoneChange}
                error={phoneNoError}
                helperText={
                  phoneNoError ? 'Please enter valid phone number' : ' '
                }
              />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 24,
                }}
              >
                <OtpInput
                  numInputs={6}
                  shouldAutoFocus
                  value={otp}
                  onChange={(otp) => {
                    setOtpVerifyErr(" ");
                    setOtp(otp)
                    if (otp.length === 6) {
                      ValidateOtp(otp)
                    }
                  }}
                  isDisabled={false}
                  inputStyle={{
                    margin: 2,
                    fontSize: 20,
                    borderRadius: 5,
                    border: '1px solid rgba(0,0,0,0.3)',
                    padding: 0,
                  }}
                />
              </div>
              <div>
                <Typography
                  style={{
                    fontSize: 11,
                    color: 'red',
                    marginTop: 10,
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  {otpVerifyErr}
                </Typography>
              </div>
            </>
          )}
          {!showCaptcha && <div id="sign-in-button"></div>}
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            paddingBottom: 2,
            marginRight: 1,
          }}
        >
          {!isOtpSent ? (
            <Button
              variant="contained"
              size="small"
              onClick={signin}
              disabled={isDisabled()}
            >
              {loading ? 'Loading...' : 'Verify'}
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setIsOtpSent(false)
                setShowCaptcha(false)
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Back'}
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  )
}
