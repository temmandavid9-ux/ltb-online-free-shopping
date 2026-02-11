import { Leaf, Gem, Crown, Sparkles, CircleDot } from 'lucide-react';

const logos = [
  {
    name: "Leaf Logo (Current)",
    icon: <Leaf className="h-8 w-8 text-primary" />,
    text: "Eden 0²",
  },
  {
    name: "Gem Logo",
    icon: <Gem className="h-8 w-8 text-primary" />,
    text: "Eden 0²",
  },
  {
    name: "Crown Logo",
    icon: <Crown className="h-8 w-8 text-primary" />,
    text: "Eden 0²",
  },
  {
    name: "Sparkles Logo",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    text: "Eden 0²",
  },
  {
    name: "Abstract Logo",
    icon: <CircleDot className="h-8 w-8 text-primary" />,
    text: "E0²",
  },
];

export default function LogoShowcase() {
  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold font-headline text-center mb-8">Logo Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {logos.map((logo, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-6 border rounded-lg bg-card shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              {logo.icon}
              <span className="font-bold text-2xl font-headline text-primary">{logo.text}</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{logo.name}</p>
          </div>
        ))}
      </div>
       <p className="text-center text-muted-foreground mt-8">Let me know which logo you prefer, and I will apply it across the application for you.</p>
    </section>
  );
}
