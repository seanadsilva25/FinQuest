require("dotenv").config();
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

const QUIZ_SEED_DATA = [
  {
    gameId: "pick_investment",
    title: "Pick Better Investment",
    icon: "📈",
    description: "Compare financial options and select the smartest choice for risk, return, and goals.",
    instructions: "Read each scenario carefully and pick the best investment choice. Earn 20 points for every correct answer!",
    questions: [
      {
        id: 1,
        question: "You have ₹10,000 saved for an emergency fund that you might need within 3 months. Which option is best suited?",
        options: [
          "High-risk speculative stocks",
          "High-yield savings account or liquid mutual fund",
          "5-year lock-in fixed deposit with early withdrawal penalty",
          "Cryptocurrency tokens"
        ],
        correctAnswer: 1,
        explanation: "Emergency funds require maximum liquidity and capital safety so money can be accessed immediately without risking loss."
      },
      {
        id: 2,
        question: "Rahul is investing for retirement 25 years away. Why are equity mutual funds generally preferred over low-interest bank savings for long horizons?",
        options: [
          "Equity guarantees fixed daily returns",
          "Equity historically beats inflation over long timeframes through compound growth",
          "Savings accounts carry higher risk of bank closure",
          "Equity investments are completely risk-free"
        ],
        correctAnswer: 1,
        explanation: "Inflation erodes purchasing power over time. Diversified equities historically outperform inflation over 10+ year horizons."
      },
      {
        id: 3,
        question: "Priya wants to reduce the overall risk of her investment portfolio. Which strategy is most effective?",
        options: [
          "Putting all savings into a single high-performing tech stock",
          "Diversifying across different asset classes (equity, debt, gold)",
          "Frequently trading stocks based on daily news rumors",
          "Holding all savings as physical cash under the mattress"
        ],
        correctAnswer: 1,
        explanation: "Diversification spreads risk across non-correlated asset classes, protecting your overall portfolio when one asset underperforms."
      },
      {
        id: 4,
        question: "Two mutual funds offer similar projected 12% p.a. returns. Fund A has an Expense Ratio of 0.5% while Fund B charges 2.2%. Which leaves you with higher net wealth?",
        options: [
          "Fund B because higher fees mean better fund management",
          "Fund A because lower expense ratios preserve more of your compounding returns",
          "Both will yield the exact same final net amount",
          "Fund B because it charges more upfront fees"
        ],
        correctAnswer: 1,
        explanation: "High expense ratios eat directly into your compounding returns over time. Lower costs mean higher net wealth accumulation."
      },
      {
        id: 5,
        question: "What is the primary difference between Debt Mutual Funds and Equity Mutual Funds?",
        options: [
          "Debt funds invest in fixed-income securities with lower volatility; Equity funds invest in company shares for growth",
          "Debt funds carry higher risk than Equity funds",
          "Equity funds pay fixed monthly interest guaranteed by the government",
          "Debt funds are illegal for retail investors"
        ],
        correctAnswer: 0,
        explanation: "Debt funds focus on capital preservation by investing in fixed-income bonds, while equity funds seek capital growth through stock ownership."
      }
    ]
  },

  {
    gameId: "spot_scam",
    title: "Spot the Scam",
    icon: "🛡️",
    description: "Learn to identify red flags, phishing tactics, and fraudulent investment schemes.",
    instructions: "Spot the financial scam in each scenario! Earn 20 points for every scam correctly identified.",
    questions: [
      {
        id: 1,
        question: "You receive a message: 'Invest ₹5,000 today and receive guaranteed ₹15,000 in your bank account in 24 hours! No risk!' What should you do?",
        options: [
          "Immediately transfer ₹5,000 to triple your money",
          "Report and block—guaranteed 200% returns overnight is a classic scam",
          "Send ₹2,500 first to test if it works",
          "Share your bank account PIN so they can credit the profit"
        ],
        correctAnswer: 1,
        explanation: "No legitimate investment can guarantee 200% returns overnight. Guaranteed high returns are a major red flag for scams."
      },
      {
        id: 2,
        question: "A caller claiming to be from your bank says your debit card is blocked and asks for your OTP to reactivate it. How should you react?",
        options: [
          "Share the OTP immediately to unblock your card",
          "Hang up immediately—banks never ask for OTPs, PINs, or passwords over phone",
          "Share your UPI PIN instead of OTP",
          "Provide your net banking password"
        ],
        correctAnswer: 1,
        explanation: "Legitimate financial institutions and banks will NEVER ask for confidential OTPs, PINs, or passwords."
      },
      {
        id: 3,
        question: "You receive an email from 'bank-security-verify-login.com' asking you to verify your bank credentials due to a suspicious login. What is this?",
        options: [
          "A ransomware attack",
          "A phishing scam designed to steal your login credentials",
          "An authorized bank security audit",
          "A mandatory software update"
        ],
        correctAnswer: 1,
        explanation: "Phishing uses fake websites mimicking real banks to trick users into revealing sensitive credentials. Always check the official domain URL."
      },
      {
        id: 4,
        question: "An influencer on social media promises 'guaranteed 50% monthly profit' if you join their paid VIP stock tips group. Are they legal?",
        options: [
          "Yes, all social media influencers are SEBI registered",
          "Unregistered tipsters offering guaranteed stock market profits are illegal and risky",
          "Yes, guaranteed stock market returns are legally enforceable",
          "Yes, if they have a blue checkmark on social media"
        ],
        correctAnswer: 1,
        explanation: "Only SEBI-registered advisers can legally provide investment advice in India. Unregistered tipsters promising guaranteed stock profits are illegal."
      },
      {
        id: 5,
        question: "What is a 'Ponzi Scheme'?",
        options: [
          "A government-backed tax saving deposit scheme",
          "A fraud where returns to older investors are paid using money collected from new investors",
          "An automated algorithmic stock trading program",
          "A type of mutual fund dividend reinvestment plan"
        ],
        correctAnswer: 1,
        explanation: "A Ponzi scheme relies on incoming funds from new recruits to pay fake profits to older investors until the scheme collapses."
      }
    ]
  },

  {
    gameId: "sip_challenge",
    title: "SIP Challenge",
    icon: "🎯",
    description: "Master the mechanics of Systematic Investment Plans, compounding, and long-term discipline.",
    instructions: "Test your knowledge on SIPs, rupee cost averaging, and compounding power. Earn 20 points per correct answer!",
    questions: [
      {
        id: 1,
        question: "What does SIP stand for in personal finance?",
        options: [
          "Systematic Investment Plan",
          "Secure Interest Payment",
          "Stock Index Portfolio",
          "Standard Investor Privilege"
        ],
        correctAnswer: 0,
        explanation: "SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly (e.g. monthly) into mutual funds."
      },
      {
        id: 2,
        question: "How does Rupee Cost Averaging benefit an investor during market downturns?",
        options: [
          "You pause investments when market prices drop",
          "You automatically buy more mutual fund units when NAV prices are lower, reducing average unit cost",
          "Your previous gains are protected from market declines",
          "The government compensates your portfolio for market dips"
        ],
        correctAnswer: 1,
        explanation: "During market dips, your fixed SIP buys more mutual fund units at lower prices, reducing your average cost per unit over time."
      },
      {
        id: 3,
        question: "Investor A starts a ₹3,000 monthly SIP at age 22. Investor B starts the same ₹3,000 SIP at age 32. Who will have higher wealth at age 50 (at 12% p.a.)?",
        options: [
          "Investor B because they earned a higher salary later",
          "Investor A due to 10 extra years of compound growth",
          "Both will have identical final wealth",
          "Neither, because SIP returns decrease over time"
        ],
        correctAnswer: 1,
        explanation: "Starting 10 years earlier gives compound interest a longer runway, producing exponentially higher final wealth."
      },
      {
        id: 4,
        question: "What is an 'Annual Step-up SIP'?",
        options: [
          "A feature where your monthly investment automatically increases by a fixed percentage each year",
          "Withdrawing your SIP profits once every year",
          "Changing your mutual fund scheme every year",
          "Pausing your SIP for 6 months every year"
        ],
        correctAnswer: 0,
        explanation: "Step-up SIP automatically increases your monthly contribution annually as your income grows, significantly boosting your final corpus."
      },
      {
        id: 5,
        question: "What is the best reaction to short-term market volatility during a 15-year SIP journey?",
        options: [
          "Panic and cancel all active SIPs immediately",
          "Stay disciplined and continue your regular SIPs to benefit from long-term compounding",
          "Double your investment every day",
          "Sell all equity holdings and hold physical cash"
        ],
        correctAnswer: 1,
        explanation: "Short-term market fluctuations are normal. Staying disciplined during market dips allows you to accumulate more units and maximize long-term wealth."
      }
    ]
  }
];

const seedQuizzes = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/finquest";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for quiz seeding...");

    for (const quizData of QUIZ_SEED_DATA) {
      await Quiz.findOneAndUpdate(
        { gameId: quizData.gameId },
        quizData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Successfully seeded quiz: ${quizData.title} (${quizData.gameId})`);
    }

    console.log("All 3 quizzes seeded successfully into MongoDB.");
  } catch (error) {
    console.error("Error seeding quizzes:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

if (require.main === module) {
  seedQuizzes();
}

module.exports = {
  QUIZ_SEED_DATA,
  seedQuizzes
};
