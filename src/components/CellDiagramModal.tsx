import React, { useState } from 'react';
import { ORGANELLES } from '../data/questions';
import { OrganelleInfo } from '../types';
import { X, Info, Sparkles, Filter, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CellDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryType = 'all' | 'genetic' | 'synthesis' | 'energy' | 'structure' | 'storage';

export const CellDiagramModal: React.FC<CellDiagramModalProps> = ({ isOpen, onClose }) => {
  const [selectedCellType, setSelectedCellType] = useState<'plant' | 'animal'>('plant');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleInfo>(ORGANELLES[0]);

  if (!isOpen) return null;

  // Filter organelles based on cell type
  const typeFiltered = ORGANELLES.filter(
    (o) => o.foundIn === 'both' || o.foundIn === selectedCellType
  );

  // Category mapping
  const categoryMap: Record<string, CategoryType> = {
    nucleus: 'genetic',
    nucleolus: 'genetic',
    ribosomes: 'synthesis',
    rough_er: 'synthesis',
    smooth_er: 'synthesis',
    golgi: 'synthesis',
    mitochondria: 'energy',
    chloroplast: 'energy',
    peroxisomes: 'energy',
    membrane: 'structure',
    cellwall: 'structure',
    cytoplasm: 'structure',
    cytoskeleton: 'structure',
    lysosomes: 'storage',
    vacuole: 'storage',
    centrosome: 'storage',
  };

  const finalFiltered = typeFiltered.filter((o) => {
    if (activeCategory === 'all') return true;
    return categoryMap[o.id] === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#F4EFE2] text-[#0E1B1F] rounded-2xl shadow-2xl max-w-5xl w-full border border-[#C9C2AE] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#16303A] text-[#F4EFE2] p-5 flex items-center justify-between border-b border-[#0E1B1F]/20">
          <div>
            <div className="font-mono-custom text-xs text-[#E0AD63] font-semibold tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E0AD63]" />
              INTERACTIVE CELL BIOLOGY REFERENCE &amp; VISUALIZER
            </div>
            <h2 className="font-mono-custom text-xl md:text-2xl font-bold mt-0.5">
              Comprehensive Cell Structures &amp; Organelles
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4EFE2] transition-colors cursor-pointer"
            aria-label="Close Reference"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="p-5 md:p-6 space-y-6">

          {/* Cell Type & Category Selector Controls */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-[#EAE3D2] p-3.5 rounded-xl border border-[#C9C2AE]">
            
            {/* Cell Type Toggle */}
            <div className="flex bg-white/80 p-1 rounded-lg border border-[#C9C2AE] shadow-inner shrink-0">
              <button
                onClick={() => {
                  setSelectedCellType('plant');
                  const plantOrganelles = ORGANELLES.filter(o => o.foundIn === 'both' || o.foundIn === 'plant');
                  if (!plantOrganelles.some(o => o.id === selectedOrganelle.id)) {
                    setSelectedOrganelle(plantOrganelles[0]);
                  }
                }}
                className={`px-4 py-2 text-xs font-mono-custom font-bold rounded-md transition-all cursor-pointer ${
                  selectedCellType === 'plant'
                    ? 'bg-[#2F855A] text-white shadow ring-2 ring-[#2F855A]/30'
                    : 'text-[#0E1B1F] hover:bg-black/5'
                }`}
              >
                🌱 Plant Cell (Cell Wall &amp; Chloroplasts)
              </button>
              <button
                onClick={() => {
                  setSelectedCellType('animal');
                  const animalOrganelles = ORGANELLES.filter(o => o.foundIn === 'both' || o.foundIn === 'animal');
                  if (!animalOrganelles.some(o => o.id === selectedOrganelle.id)) {
                    setSelectedOrganelle(animalOrganelles[0]);
                  }
                }}
                className={`px-4 py-2 text-xs font-mono-custom font-bold rounded-md transition-all cursor-pointer ${
                  selectedCellType === 'animal'
                    ? 'bg-[#3182CE] text-white shadow ring-2 ring-[#3182CE]/30'
                    : 'text-[#0E1B1F] hover:bg-black/5'
                }`}
              >
                🔬 Animal Cell (Flexible &amp; Lysosomes)
              </button>
            </div>

            {/* Organelle Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono-custom text-[11px]">
              <span className="text-[#6B6455] font-semibold flex items-center gap-1 mr-1 text-xs">
                <Filter className="w-3.5 h-3.5" />
                Category:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'genetic', label: 'Nucleus & DNA' },
                { id: 'synthesis', label: 'Protein/Lipid Factory' },
                { id: 'energy', label: 'Energy & Respiration' },
                { id: 'structure', label: 'Boundary & Framework' },
                { id: 'storage', label: 'Waste & Storage' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as CategoryType)}
                  className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#0E1B1F] text-[#F4EFE2] font-bold shadow-sm'
                      : 'bg-white/70 text-[#0E1B1F] hover:bg-white border border-[#C9C2AE]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Section: Visual Schematic Cell Diagram */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Interactive Visual Cell Canvas Representation */}
              <div
                className={`relative min-h-[300px] md:min-h-[340px] rounded-2xl border-2 p-4 transition-all overflow-hidden flex flex-col justify-between shadow-inner ${
                  selectedCellType === 'plant'
                    ? 'bg-[#48BB78]/10 border-[#2F855A]'
                    : 'bg-[#3182CE]/10 border-[#3182CE]'
                }`}
              >
                {/* Visual Plant Cell Wall Border Graphic */}
                {selectedCellType === 'plant' && (
                  <div className="absolute inset-2 border-4 border-[#2F855A] rounded-xl pointer-events-none">
                    <span className="absolute top-1.5 left-2.5 text-[10px] font-mono-custom font-bold text-[#2F855A] uppercase bg-[#F4EFE2] px-2 py-0.5 rounded border border-[#2F855A]/30">
                      Cellulose Cell Wall (Rigid Outer Structure)
                    </span>
                  </div>
                )}

                {/* Inner Cell Membrane Boundary */}
                <div className={`relative w-full h-full my-auto rounded-xl border-2 border-dashed p-4 flex flex-col justify-between ${
                  selectedCellType === 'plant' ? 'border-[#3182CE] bg-[#2F855A]/5' : 'border-[#3182CE] bg-[#3182CE]/5'
                }`}>
                  <div className="flex justify-between items-center text-[10px] font-mono-custom font-bold text-[#2C5F8A] mb-2 uppercase">
                    <span>{selectedCellType === 'plant' ? '🌱 Plant Cell Matrix' : '🔬 Animal Cell Matrix'}</span>
                    <span>Click any organelle badge to inspect</span>
                  </div>

                  {/* Organelles Badges Interactive Grid Layout */}
                  <div className="flex flex-wrap items-center justify-center gap-2 py-4">
                    {finalFiltered.map((o) => {
                      const isSelected = selectedOrganelle.id === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => setSelectedOrganelle(o)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono-custom font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                            isSelected
                              ? 'bg-[#0E1B1F] text-[#F4EFE2] border-[#0E1B1F] scale-105 ring-2 ring-[#E0AD63] shadow-md'
                              : 'bg-white text-[#0E1B1F] border-[#C9C2AE] hover:border-[#0E1B1F] hover:scale-102'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: o.color }}
                          />
                          <span>{o.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] font-mono-custom text-[#6B6455] text-center italic bg-white/70 p-2 rounded-lg border border-[#C9C2AE]/60">
                    Showing {finalFiltered.length} organelle{finalFiltered.length === 1 ? '' : 's'} in this view
                  </div>
                </div>
              </div>

              {/* Organelle Key Comparison Quick Summary */}
              <div className="bg-[#EAE3D2] p-3.5 rounded-xl border border-[#C9C2AE] text-xs font-serif-custom text-[#3A352B] leading-relaxed">
                <strong className="font-mono-custom text-[#2C5F8A] uppercase tracking-wide block mb-1">
                  💡 IB MYP Organelle Key Distinction:
                </strong>
                <strong>Plant cells</strong> contain a rigid <strong>Cell Wall</strong> (cellulose), <strong>Chloroplasts</strong> (photosynthesis), and a <strong>Large Permanent Vacuole</strong> (turgor pressure). <strong>Animal cells</strong> contain <strong>Centrioles/Centrosome</strong> (cell division) and abundant <strong>Lysosomes</strong> (waste digestion).
              </div>
            </div>

            {/* Right Section: Organelle Detail Inspector */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white p-5 md:p-6 rounded-2xl border border-[#C9C2AE] shadow-md">
              <div className="space-y-4">
                
                {/* Selected Organelle Header */}
                <div className="pb-3 border-b border-[#C9C2AE] flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-5 h-5 rounded-full border-2 border-black/30 shrink-0 shadow-sm"
                      style={{ backgroundColor: selectedOrganelle.color }}
                    />
                    <div>
                      <h3 className="font-mono-custom text-lg font-bold text-[#0E1B1F] leading-tight">
                        {selectedOrganelle.name}
                      </h3>
                      <span className="font-mono-custom text-[11px] text-[#2C5F8A] font-semibold">
                        Organelle ID: {selectedOrganelle.id}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono-custom font-bold uppercase px-2.5 py-1 rounded-md border shrink-0 ${
                    selectedOrganelle.foundIn === 'both'
                      ? 'bg-[#EAE3D2] text-[#2C5F8A] border-[#C9C2AE]'
                      : selectedOrganelle.foundIn === 'plant'
                      ? 'bg-[#48BB78]/20 text-[#2F855A] border-[#2F855A]'
                      : 'bg-[#3182CE]/20 text-[#3182CE] border-[#3182CE]'
                  }`}>
                    {selectedOrganelle.foundIn === 'both'
                      ? 'Both Cells'
                      : selectedOrganelle.foundIn === 'plant'
                      ? 'Plant Only'
                      : 'Animal Only'}
                  </span>
                </div>

                {/* Primary Function */}
                <div className="bg-[#F4EFE2]/60 p-3.5 rounded-xl border border-[#C9C2AE]">
                  <div className="font-mono-custom text-[11px] font-bold text-[#2C5F8A] uppercase tracking-wider mb-0.5">
                    🎯 Primary Function
                  </div>
                  <div className="font-mono-custom text-sm font-bold text-[#0E1B1F]">
                    {selectedOrganelle.function}
                  </div>
                </div>

                {/* Detailed Biological Description */}
                <div>
                  <div className="font-mono-custom text-[11px] font-bold text-[#6B6455] uppercase tracking-wider mb-1">
                    🔬 Detailed Biological Structure &amp; Role
                  </div>
                  <p className="font-serif-custom text-xs md:text-sm text-[#3A352B] leading-relaxed bg-white p-3 rounded-lg border border-[#C9C2AE]">
                    {selectedOrganelle.description}
                  </p>
                </div>

                {/* Biological Pathway Note */}
                <div className="p-3 rounded-xl bg-[#16303A] text-[#F4EFE2] text-xs font-serif-custom border border-[#0E1B1F]">
                  <strong className="font-mono-custom text-[#E0AD63] text-[11px] uppercase tracking-wider block mb-1">
                    💡 Exam Tip / Pathway Context:
                  </strong>
                  {selectedOrganelle.id === 'rough_er' || selectedOrganelle.id === 'golgi' || selectedOrganelle.id === 'ribosomes'
                    ? 'Part of the Protein Secretion Pathway: Ribosome (Synthesizes) → Rough ER (Folds/Transports) → Golgi Apparatus (Modifies/Packages) → Secretory Vesicle (Exocytosis).'
                    : selectedOrganelle.id === 'mitochondria'
                    ? 'Energy Law Reminder: Mitochondria do NOT create energy out of nothing. They release chemical energy stored in glucose via aerobic respiration.'
                    : selectedOrganelle.id === 'smooth_er' || selectedOrganelle.id === 'peroxisomes'
                    ? 'Abundant in liver cells due to their primary role in detoxifying metabolic wastes, drugs, and hydrogen peroxide.'
                    : selectedOrganelle.id === 'nucleolus' || selectedOrganelle.id === 'nucleus'
                    ? 'The nucleolus synthesizes rRNA and builds ribosome subunits inside the nucleus.'
                    : 'Critical organelle for maintaining cellular homeostasis and vital lifeprocesses.'}
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="mt-5 pt-3 border-t border-[#C9C2AE] flex items-center justify-between text-xs">
                <span className="font-mono-custom text-[#6B6455] italic">
                  Interactive reference ready
                </span>
                <button
                  onClick={onClose}
                  className="font-mono-custom text-xs font-bold px-4 py-2 bg-[#0E1B1F] text-[#F4EFE2] rounded-lg hover:bg-[#1E3A41] transition-colors cursor-pointer shadow"
                >
                  Return to Practice Slides
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
