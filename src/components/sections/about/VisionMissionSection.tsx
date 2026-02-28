export default function VisionMissionSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Vision */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
          <p className="leading-relaxed text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Mission */}
        <div className="flex flex-col gap-4 md:text-right">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="leading-relaxed text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </section>
  );
}
