import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataCell } from "@/components/ui/DataCell";
import { StatCard } from "@/components/ui/StatCard";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import { PriceChange } from "@/components/ui/PriceChange";
import { MetalIcon } from "@/components/ui/MetalIcon";
import { cn } from "@/lib/utils";
import { Palette, Type, Component, Layout, BookOpen } from "lucide-react";

const SECTIONS = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "components", label: "Components", icon: Component },
  { id: "spacing", label: "Spacing & Layout", icon: Layout },
];

function SectionTitle({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 mb-6">
      <h2 className="text-2xl font-bold tracking-tight mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface ColorSwatchProps {
  name: string;
  variable: string;
  colorClass: string;
  foregroundClass?: string;
}

function ColorSwatch({
  name,
  variable,
  colorClass,
  foregroundClass,
}: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          "h-16 rounded-lg border border-border/30 flex items-center justify-center",
          colorClass,
        )}
      >
        {foregroundClass && (
          <span className={cn("text-xs font-semibold", foregroundClass)}>
            Aa
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium">{name}</p>
        <p className="text-[10px] font-mono text-muted-foreground">
          {variable}
        </p>
      </div>
    </div>
  );
}

function ColorsSection() {
  return (
    <>
      <SectionTitle
        id="colors"
        title="Color Palette"
        description="Semantic color tokens defined as CSS custom properties and mapped through Tailwind."
      />
      <Card className="p-6 space-y-8">
        <SubSection title="Core">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch
              name="Background"
              variable="--background"
              colorClass="bg-background"
            />
            <ColorSwatch
              name="Foreground"
              variable="--foreground"
              colorClass="bg-foreground"
              foregroundClass="text-background"
            />
            <ColorSwatch name="Card" variable="--card" colorClass="bg-card" />
            <ColorSwatch
              name="Primary"
              variable="--primary"
              colorClass="bg-primary"
              foregroundClass="text-primary-foreground"
            />
            <ColorSwatch
              name="Secondary"
              variable="--secondary"
              colorClass="bg-secondary"
              foregroundClass="text-secondary-foreground"
            />
            <ColorSwatch
              name="Muted"
              variable="--muted"
              colorClass="bg-muted"
              foregroundClass="text-muted-foreground"
            />
            <ColorSwatch
              name="Accent"
              variable="--accent"
              colorClass="bg-accent"
              foregroundClass="text-accent-foreground"
            />
            <ColorSwatch
              name="Border"
              variable="--border"
              colorClass="bg-border"
            />
          </div>
        </SubSection>

        <SubSection title="Feedback">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch
              name="Positive"
              variable="hsl(--positive)"
              colorClass="bg-emerald-500"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Negative"
              variable="hsl(--negative)"
              colorClass="bg-red-500"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Destructive"
              variable="--destructive"
              colorClass="bg-destructive"
              foregroundClass="text-destructive-foreground"
            />
          </div>
        </SubSection>

        <SubSection title="Metal Palette">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch
              name="Copper (CU)"
              variable="orange-500"
              colorClass="bg-orange-500"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Aluminum (AL)"
              variable="slate-400"
              colorClass="bg-slate-400"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Zinc (ZN)"
              variable="zinc-400"
              colorClass="bg-zinc-400"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Nickel (NI)"
              variable="emerald-500"
              colorClass="bg-emerald-500"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Lead (PB)"
              variable="stone-500"
              colorClass="bg-stone-500"
              foregroundClass="text-white"
            />
            <ColorSwatch
              name="Tin (SN)"
              variable="amber-600"
              colorClass="bg-amber-600"
              foregroundClass="text-white"
            />
          </div>
        </SubSection>
      </Card>
    </>
  );
}

function TypographySection() {
  return (
    <>
      <SectionTitle
        id="typography"
        title="Typography"
        description="Font families, heading hierarchy, and text patterns used across the application."
      />
      <Card className="p-6 space-y-8">
        <SubSection title="Font Families">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/20 border border-border/30">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                System Font — Headings & Body
              </span>
              <span className="text-2xl">
                The quick brown fox jumps over the lazy dog
              </span>
              <code className="text-[11px] font-mono text-muted-foreground/70">
                font-sans / system-ui
              </code>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-lg bg-muted/20 border border-border/30">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Mono — Numbers & Code
              </span>
              <span className="font-mono text-2xl tabular-nums">
                $8,451.25 +12.50%
              </span>
              <code className="text-[11px] font-mono text-muted-foreground/70">
                font-mono / monospace
              </code>
            </div>
          </div>
        </SubSection>

        <SubSection title="Heading Hierarchy">
          <div className="space-y-4">
            <div className="flex items-baseline gap-4 border-b border-border/20 pb-3">
              <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
                text-3xl
              </span>
              <span className="text-3xl font-bold tracking-tight">
                Page Title
              </span>
            </div>
            <div className="flex items-baseline gap-4 border-b border-border/20 pb-3">
              <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
                text-2xl
              </span>
              <span className="text-2xl font-bold tracking-tight">
                Section Title
              </span>
            </div>
            <div className="flex items-baseline gap-4 border-b border-border/20 pb-3">
              <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
                text-lg
              </span>
              <span className="text-lg font-semibold">Card Title</span>
            </div>
            <div className="flex items-baseline gap-4 border-b border-border/20 pb-3">
              <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
                text-sm
              </span>
              <span className="text-sm">Body Text</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">
                text-xs
              </span>
              <span className="text-xs text-muted-foreground">
                Caption / Helper
              </span>
            </div>
          </div>
        </SubSection>
      </Card>
    </>
  );
}

function ComponentsSection() {
  return (
    <>
      <SectionTitle
        id="components"
        title="Components"
        description="Reusable UI primitives that form the building blocks of the application."
      />

      {/* Button */}
      <Card className="p-6 mb-4">
        <h3 className="text-lg font-semibold mb-5">Button</h3>
        <SubSection title="Variants">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </SubSection>
        <SubSection title="Sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </SubSection>
      </Card>

      {/* Badge */}
      <Card className="p-6 mb-4">
        <h3 className="text-lg font-semibold mb-5">Badge</h3>
        <SubSection title="Variants">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </SubSection>
      </Card>

      {/* MetalIcon */}
      <Card className="p-6 mb-4">
        <h3 className="text-lg font-semibold mb-5">MetalIcon</h3>
        <SubSection title="All Metals">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <MetalIcon symbol="CU" size="lg" />
              <span className="text-xs text-muted-foreground">Copper</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MetalIcon symbol="AL" size="lg" />
              <span className="text-xs text-muted-foreground">Aluminum</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MetalIcon symbol="ZN" size="lg" />
              <span className="text-xs text-muted-foreground">Zinc</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MetalIcon symbol="NI" size="lg" />
              <span className="text-xs text-muted-foreground">Nickel</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MetalIcon symbol="PB" size="lg" />
              <span className="text-xs text-muted-foreground">Lead</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MetalIcon symbol="SN" size="lg" />
              <span className="text-xs text-muted-foreground">Tin</span>
            </div>
          </div>
        </SubSection>
      </Card>

      {/* DataCell & StatCard */}
      <Card className="p-6 mb-4">
        <h3 className="text-lg font-semibold mb-5">Data Display</h3>
        <SubSection title="DataCell">
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Current Price
              </span>
              <DataCell value={8542.5} format="price" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                24h Volume
              </span>
              <DataCell value={12450} format="number" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Change
              </span>
              <DataCell value={2.45} format="percent" showSign />
            </div>
          </div>
        </SubSection>
        <SubSection title="StatCard">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total P&L"
              value="+$12,450"
              change={{ value: "2.4%", isPositive: true }}
            />
            <StatCard
              label="Win Rate"
              value="68%"
              change={{ value: "5%", isPositive: true }}
            />
            <StatCard
              label="Drawdown"
              value="-$3,200"
              change={{ value: "0.11%", isPositive: false }}
            />
          </div>
        </SubSection>
      </Card>

      {/* ConnectionStatus & PriceChange */}
      <Card className="p-6 mb-4">
        <h3 className="text-lg font-semibold mb-5">Status Indicators</h3>
        <SubSection title="ConnectionStatus">
          <div className="flex items-center gap-8">
            <ConnectionStatus />
            <p className="text-xs text-muted-foreground">
              (Shows live connection state)
            </p>
          </div>
        </SubSection>
        <SubSection title="PriceChange">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-2">
                Positive
              </span>
              <PriceChange change={45.5} changePercent={0.54} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-2">
                Negative
              </span>
              <PriceChange change={-32.75} changePercent={-0.39} />
            </div>
          </div>
        </SubSection>
      </Card>
    </>
  );
}

function SpacingSection() {
  const spacingScale = [
    { name: "p-1 / gap-1", size: "0.25rem (4px)", class: "w-1" },
    { name: "p-2 / gap-2", size: "0.5rem (8px)", class: "w-2" },
    { name: "p-3 / gap-3", size: "0.75rem (12px)", class: "w-3" },
    { name: "p-4 / gap-4", size: "1rem (16px)", class: "w-4" },
    { name: "p-5 / gap-5", size: "1.25rem (20px)", class: "w-5" },
    { name: "p-6 / gap-6", size: "1.5rem (24px)", class: "w-6" },
    { name: "p-8 / gap-8", size: "2rem (32px)", class: "w-8" },
  ];

  return (
    <>
      <SectionTitle
        id="spacing"
        title="Spacing & Layout"
        description="Common spacing scale and recurring layout patterns."
      />
      <Card className="p-6 space-y-8">
        <SubSection title="Spacing Scale">
          <div className="space-y-3">
            {spacingScale.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-muted-foreground w-28 shrink-0">
                  {s.name}
                </span>
                <div className={cn("h-4 rounded-sm bg-primary/60", s.class)} />
                <span className="text-[10px] text-muted-foreground">
                  {s.size}
                </span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Common Card Padding">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-dashed border-primary/30 rounded-lg">
              <div className="p-4 bg-primary/5 rounded-lg">
                <span className="text-[10px] font-mono text-primary">p-4</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Compact cards
                </p>
              </div>
            </div>
            <div className="border border-dashed border-primary/30 rounded-lg">
              <div className="p-5 bg-primary/5 rounded-lg">
                <span className="text-[10px] font-mono text-primary">p-5</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Standard cards
                </p>
              </div>
            </div>
            <div className="border border-dashed border-primary/30 rounded-lg">
              <div className="p-6 bg-primary/5 rounded-lg">
                <span className="text-[10px] font-mono text-primary">p-6</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Spacious cards
                </p>
              </div>
            </div>
          </div>
        </SubSection>
      </Card>
    </>
  );
}

export function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState("colors");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebar Navigation */}
      <nav className="lg:sticky lg:top-24 lg:self-start lg:w-52 shrink-0">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">Style Guide</span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            LME Trading Design System
          </p>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </Card>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-10 pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Style Guide
          </h1>
          <p className="text-sm text-muted-foreground">
            LME Trading Design System — Living documentation of colors,
            typography, components, and patterns.
          </p>
        </div>

        <ColorsSection />
        <TypographySection />
        <ComponentsSection />
        <SpacingSection />
      </div>
    </div>
  );
}
