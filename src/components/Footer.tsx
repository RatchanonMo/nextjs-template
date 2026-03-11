import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-4 py-6 sm:px-6 sm:py-8 md:p-10">
      <div className="mx-auto overflow-hidden rounded-3xl bg-black md:rounded-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center">
          {/* Left: brand + description + contact */}
          <div className="flex flex-col gap-4 px-6 py-10 sm:px-10 md:pl-16 md:pr-8">
            <Link href="/">
              <Image
                src="/images/footer/logo.svg"
                alt="Salespoint"
                width={180}
                height={30}
                className="md:w-[230px]"
              />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-white font-semibold md:text-base">
              SalePoint AI is your sales intelligence partner, helping teams
              discover real decision-makers, gain contact insights, and sell
              more effectively with AI.
            </p>
            <a
              href="mailto:contact@solveserve.group"
              className="text-sm text-white/60 hover:text-white/80 transition-colors"
            >
              contact@solveserve.group
            </a>
          </div>

          {/* Right: circuit decoration + glowing icon — hidden on mobile */}
          <div className="hidden md:flex justify-end items-center">
            <Image
              src="/images/footer/agent.svg"
              alt="Salespoint Agent"
              width={600}
              height={600}
              className="w-full max-w-sm lg:max-w-md xl:max-w-lg"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
