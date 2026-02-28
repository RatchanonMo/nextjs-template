export default function QuoteSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <blockquote className="flex flex-col gap-4">
        <p className="text-2xl font-bold leading-snug text-gray-900 md:text-3xl">
          &ldquo; Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do{" "}
          <span className="text-primary">eiusmod tempor</span> incididunt
          &rdquo;
        </p>
        <footer className="text-right text-base font-medium text-gray-600">
          &mdash; KhaveeAI BD
        </footer>
      </blockquote>
    </section>
  );
}
