import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import CountryCode from "../../../data/countrycode.json";
import { useEffect } from "react";
import Tab from "../../Common/Tab";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.USER);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    countryCode: "+91", // Default country code
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, contactNumber, countryCode, password, confirmPassword } = formData;

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      countryCode: "+91",
    }));
  }, []);


  // Handle input fields, when some value changes
  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    const fullContactNumber = `${countryCode} ${contactNumber}`;
    console.log(" full Contact :",fullContactNumber)

    const signupData = {
      ...formData,
      contactNumber: fullContactNumber,
      accountType,
    };

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData));
    // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate));

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      countryCode: "+91",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.USER);
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "User",
      type: ACCOUNT_TYPE.USER,
    },
    {
      id: 2,
      tabName: "Provider",
      type: ACCOUNT_TYPE.PROVIDER,
    },
    {
      id: 3,
      tabName: "Admin",
      type: ACCOUNT_TYPE.ADMIN,
    }
  ];

  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      {/* Form */}
      <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="form-style w-full"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="form-style w-full"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="text"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="form-style w-full"
          />
        </label>

        <div className="flex gap-x-4">
          <label className="w-[25%]">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Country Code <sup className="text-pink-200">*</sup>
            </p>
            <select
              name="countryCode"
              value={countryCode}
              onChange={handleOnChange}
              className="form-style w-full"
            >
              {CountryCode.map((ele, i) => (
                <option key={i} value={ele.code}>
                  {ele.code} - {ele.country}
                </option>
              ))}
            </select>
          </label>
          <label className="w-[75%]">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Contact Number <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="number"
              name="contactNumber"
              value={contactNumber}
              onChange={handleOnChange}
              placeholder="12345 67890"
              className="form-style w-full"
            />
          </label>
        </div>

        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="form-style w-full !pr-10"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="form-style w-full !pr-10"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
