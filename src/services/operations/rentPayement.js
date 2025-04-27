import { toast } from "react-hot-toast";
import rzpLogo from "../../assets/Logo/S.png";
import { setPaymentLoading } from "../../slices/slotSlice";
import { apiConnector } from "../apiConnector";
import { paymentEndpoints } from "../apis";

const {
  PAYMENT_API,
  VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = paymentEndpoints;

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// Book the rent slot
export async function BookRent(
  token,
  slotId,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");
  console.log("Initial slot value:", slotId);

  try {
    console.log("Entering try block...");
    console.log("Sending slotId to backend:", slotId);

    // Load the Razorpay script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your Internet Connection.");
      return;
    }

    // Confirm slot value right after loading the script
    console.log("After loading script - slot value:", slotId);

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      PAYMENT_API,
      {
        slotId,
        slotType: "rent", // Specify that this is a rent slot
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("Order response:", orderResponse.data);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    // Set up Razorpay options
    const options = {
      key: "rzp_test_axDmHAhUL0SV19",
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`, // Razorpay requires amount in the smallest currency unit
      order_id: orderResponse.data.data.id, // Order ID from backend
      name: "Smart-Hub",
      description: "Thank you for booking the rent item.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      config: {
        display: {
          blocks: {
            banks: {
              name: 'All Payment Options',
              instruments: [
                { method: 'upi' },
                { method: 'card' },
                { method: 'wallet' },
                { method: 'netbanking' },
              ],
            },
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: false,
          },
        },
      },
      handler: function (response) {
        console.log("response.razorpay_order_id :", response.razorpay_order_id);
        console.log("response.razorpay_payment_id :", response.razorpay_payment_id);
        console.log("response.razorpay_signature :", response.razorpay_signature);
        console.log("orderResponse.data.data.rentItemId :", orderResponse.data.data.itemId);
        console.log("token :" + token);
        verifyRentPayment(
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            itemId: orderResponse.data.data.itemId, // Rent Item ID should now be available here
            slotId: slotId,
            slotType: "rent",
          },
          token,
          navigate,
          dispatch
        );
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
      },
    };

    // Open Razorpay payment window
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.");
      console.log(response.error);
    });

  } catch (error) {
    console.log("In catch slot :", slotId);
    console.error("PAYMENT API ERROR:", error);
    toast.error("Could Not make Payment.");
  }

  toast.dismiss(toastId);
}

// Verify the Rent Payment
async function verifyRentPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
  try {
    // Call the verify API with all required fields for verification
    const response = await apiConnector("POST", VERIFY_API, {
      razorpay_order_id: bodyData.razorpay_order_id,
      razorpay_payment_id: bodyData.razorpay_payment_id,
      razorpay_signature: bodyData.razorpay_signature,
      itemId: bodyData.itemId, // Rent Item ID from the slot
      slotId: bodyData.slotId, // Slot ID
      slotType: "rent",
    }, {
      Authorization: `Bearer ${token}`,
    });

    console.log("VERIFY RENT PAYMENT RESPONSE FROM BACKEND............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful. Your rent item is booked.");
    navigate("/dashboard/history/rents");
  } catch (error) {
    console.log("RENT PAYMENT VERIFY ERROR............", error);
    toast.error("Could Not Verify Payment.");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

// Send the Payment Success Email (Reused from BookService)
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error);
  }
}