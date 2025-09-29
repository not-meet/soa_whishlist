"use client"
import { AuroraText } from "@/components/ui/aurora-text";
import { Highlighter } from "@/components/ui/highlighter";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { WavyBackground } from "@/components/ui/wavy-background";
import confetti from "canvas-confetti";
import React, { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000; // 2 seconds
    const colors = ["#ffd600", "#17edc6", "#FA7D51"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const validateEmail = (email: string) => {
    // Simple email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address (e.g., yourname@example.com)');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setMessage('Thanks a lot ! we\'ll see you on the other side ! ');
        setEmail('');
        // Trigger confetti on success
        triggerConfetti();
      }
    } catch (err) {
      setError('Failed to join waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const words = [
    {
      text: "Just select, choose your requirments and done!",
    },
    {
      text: "Your go to auth solution for your next big project!",
    },
    {
      text: "all you need is to arrange the envs and done!",
    },
    {
      text: "want auth!? let SOA handle it!",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Main heading */}
          <AuroraText
            colors={["#fafafa", "#e0e0e0", "#bdbdbd"]}
            className="font-fjalla_one text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-100 mb-4 sm:mb-6 font-extrabold leading-tight px-2"
          >
            Setting up auth made so simple that anyone can do it in{" "}
            <AuroraText
              colors={["#FA7D51", "#0535f4", "#FA76F2", "#68EDE9"]}
              className="font-fjalla_one text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-100 font-extrabold"
            >
              <span className="text-gray-100">Minutes!</span>
            </AuroraText>
          </AuroraText>

          {/* Subheading */}
          <div className="mb-6 sm:mb-8">
            <TypewriterEffectSmooth
              words={words}
              className="font-inter text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300"
            />
          </div>

          {/* CTA */}
          <p className="font-inter text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 font-bold mb-6 sm:mb-8 px-2">
            Be the first to experience{" "}
            <span className="font-inter text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 font-bold">
              <Highlighter delay={3000} isView={true} iterations={3} action="underline" color="#17edc6">
                SOA
              </Highlighter>
            </span>
          </p>

          {/* Email input and button */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-2 px-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear error when user starts typing again
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="yourname@example.com"
              disabled={loading}
              className="font-inter flex-1 px-4 py-3 sm:py-3 text-sm sm:text-base border ring-none hover:ring-[#242424] focus:ring-[#242424] rounded-lg text-[#17edc6] placeholder-gray-500 focus:outline-none border-[#242424] focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              aria-invalid={!!error}
              aria-describedby="email-error"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="relative bg-[gray]/10 font-inter text-white font-bold text-sm sm:text-base dark:bg-[gray]/10 border-2 border-[#242424] dark:border-[#242424] hover:border-[#242424] dark:hover:border-[#242424] rounded-xl px-6 py-3 sm:py-3 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto sm:min-w-[140px]"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                'Join Waitlist'
              )}
            </button>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <p className="font-inter text-xs sm:text-sm text-green-400 mt-2 animate-fade-in px-2">
              {message}
            </p>
          )}
          {error && (
            <p id="email-error" className="font-inter text-xs sm:text-sm text-red-400 mt-2 animate-fade-in px-2">
              {error}
            </p>
          )}

          {/* Privacy note */}
          <p className="inter text-xs sm:text-sm text-gray-500 mt-2 px-2">
            No spam, just updates on our launch. Unsubscribe anytime.
          </p>
        </div>
      </div>
      <WavyBackground waveWidth={70} className="z-[-1]" />
    </>
  )
}
