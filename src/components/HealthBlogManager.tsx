import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Badge } from './common/Badge';
import { Modal } from './common/Modal';
import {
  BookOpen,
  Search,
  Plus,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Bookmark,
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2
} from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Clinical Protocols' | 'Cardiology' | 'Hospital Policy' | 'Patient Care' | 'Wellness & Research';
  authorName: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'BLOG-2026-01',
    title: 'Updated Hospital Post-Operative Infection Control Guidelines (2026 Edition)',
    summary: 'Comprehensive review of revised sterile barrier precautions, antibiotic prophylaxis timing, and surgical site surveillance protocols across all inpatient wards.',
    content: `### Executive Summary
Maintaining strict infection control standards is paramount for optimal patient outcomes following surgical interventions. The 2026 revised clinical guidelines incorporate international patient safety recommendations.

### Key Protocol Updates:
1. **Pre-Operative Preparation**: Chlorhexidine bath required within 12 hours prior to scheduled surgery.
2. **Prophylactic Antibiotics**: Administration strictly timed within 60 minutes prior to surgical incision.
3. **Surveillance & Monitoring**: Daily automated wound inspection logging in patient EHR drawer until discharge.
4. **Sterile Field Integrity**: Mandatory HEPA filtration check before entering operating rooms.

### Implementation Guidelines for Nursing & Surgical Staff:
All clinical personnel must undergo annual recertification on high-level disinfection and terminal cleaning procedures. Direct any questions to the Hospital Safety Committee.`,
    category: 'Clinical Protocols',
    authorName: 'Dr. Sarah Jenkins',
    authorRole: 'Chief of Clinical Quality & Safety',
    publishedDate: 'August 18, 2026',
    readTime: '5 min read',
    tags: ['Infection Control', 'Surgical Safety', 'Clinical Protocol'],
    featured: true
  },
  {
    id: 'BLOG-2026-02',
    title: 'Advances in Continuous Remote Cardiac Monitoring & AI Triage',
    summary: 'How real-time telemetry integration with patient EHR improves early detection of atrial fibrillation and telemetry alert accuracy in telemetry wards.',
    content: `### Introduction
Remote physiological telemetry has evolved from passive waveform displays to proactive AI-driven predictive triage.

### Benefits Observed in Clinical Practice:
- **30% reduction** in false alarm fatigue across telemetry nurses.
- Immediate detection of paroxysmal atrial fibrillation and ST-segment changes.
- Automated synchronization with the Hospital Command Center dashboard.

### Recommendations for On-Duty Staff:
Ensure telemetry transmitters are calibrated during shift change handovers. Check electrode replacement every 48 hours to preserve waveform fidelity.`,
    category: 'Cardiology',
    authorName: 'Dr. Robert Chen',
    authorRole: 'Head of Cardiology & Telemetry',
    publishedDate: 'August 15, 2026',
    readTime: '4 min read',
    tags: ['Cardiology', 'Telemetry', 'AI Triage', 'Patient Monitoring'],
    featured: false
  },
  {
    id: 'BLOG-2026-03',
    title: 'Optimizing OPD Check-in Workflows & Patient Waiting Times',
    summary: 'Analysis of digital check-in tokens and automated queue routing in reducing average outpatient waiting time down to under 12 minutes.',
    content: `### Operational Audit Results
Through the implementation of digital check-in tokens and reception kiosk routing, Aura Health Center has achieved a 42% reduction in OPD registration bottlenecks.

### Core Workflow Insights:
- Patients receiving e-tokens on arrival bypass manual registration counters.
- Automated SMS reminders trigger 30 minutes prior to consultation slots.
- Real-time queue sync keeps receptionists and physicians informed of patient arrivals.`,
    category: 'Hospital Policy',
    authorName: 'Elena Rostova',
    authorRole: 'Director of Healthcare Operations',
    publishedDate: 'August 10, 2026',
    readTime: '3 min read',
    tags: ['OPD Workflow', 'Patient Satisfaction', 'Operations'],
    featured: false
  },
  {
    id: 'BLOG-2026-04',
    title: 'Pediatric Inpatient Care & Family-Centered Communication',
    summary: 'Best practices for clinical staff in engaging pediatric patients and their families during ward rounds and discharge planning.',
    content: `### Patient-Centric Approach in Pediatrics
Effective communication reduces anxiety for young patients and improves compliance with home medication regimens post-discharge.

### Recommended Communication Guidelines:
1. Conduct bedside multi-disciplinary rounds with parents present.
2. Use clear, jargon-free e-Prescription instructions for home care.
3. Provide visual medication schedules upon discharge.`,
    category: 'Patient Care',
    authorName: 'Dr. Marcus Vance',
    authorRole: 'Chief Pediatric Consultant',
    publishedDate: 'August 05, 2026',
    readTime: '6 min read',
    tags: ['Pediatrics', 'Patient Care', 'Communication'],
    featured: false
  }
];

export const HealthBlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // New Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Clinical Protocols');
  const [authorName, setAuthorName] = useState('Dr. Sarah Jenkins');
  const [tagsInput, setTagsInput] = useState('Clinical, Hospital');

  const categories = ['All', 'Clinical Protocols', 'Cardiology', 'Hospital Policy', 'Patient Care', 'Wellness & Research'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !q || post.title.toLowerCase().includes(q) || post.summary.toLowerCase().includes(q) || post.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: `BLOG-2026-${Date.now().toString().slice(-4)}`,
      title,
      summary,
      content,
      category,
      authorName,
      authorRole: 'Clinical Specialist',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '4 min read',
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };
    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-medblue-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-tealbrand-500/20 text-tealbrand-300 text-xs px-2.5 py-0.5 rounded-full border border-tealbrand-500/30 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Clinical Knowledge Hub
            </span>
            <span className="text-xs text-slate-300">| Health Bulletins & Research Updates</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Hospital Clinical Blog & Bulletins</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Stay updated with verified medical guidelines, clinical SOPs, healthcare operations research, and hospital announcement bulletins.
          </p>
        </div>

        <Button variant="teal" size="sm" onClick={() => setIsCreateModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Publish Article
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, protocol, or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-tealbrand-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article Card */}
      {featuredPost && selectedCategory === 'All' && !searchQuery && (
        <Card className="bg-gradient-to-br from-navy-950 to-navy-900 text-white border-none p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="bg-tealbrand-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Featured Bulletin
                </span>
                <span className="text-xs text-slate-400 font-mono">{featuredPost.category}</span>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug">{featuredPost.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{featuredPost.summary}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <User className="w-3.5 h-3.5 text-tealbrand-400" /> {featuredPost.authorName} ({featuredPost.authorRole})
                </span>
                <span>• {featuredPost.publishedDate}</span>
                <span>• {featuredPost.readTime}</span>
              </div>
            </div>

            <Button variant="teal" size="md" onClick={() => setSelectedPost(featuredPost)} className="shrink-0 self-start md:self-center">
              Read Full Article
            </Button>
          </div>
        </Card>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="teal" size="sm">{post.category}</Badge>
                <span className="text-[10px] text-slate-400 font-mono">{post.readTime}</span>
              </div>

              <h3 className="text-sm font-bold text-navy-900 hover:text-medblue-600 cursor-pointer line-clamp-2" onClick={() => setSelectedPost(post)}>
                {post.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-navy-900">{post.authorName}</p>
                <p className="text-[10px] text-slate-400">{post.publishedDate}</p>
              </div>

              <button
                onClick={() => setSelectedPost(post)}
                className="text-xs font-semibold text-medblue-600 hover:text-medblue-800 flex items-center gap-1"
              >
                Read <BookOpen className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {selectedPost && (
        <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} title={selectedPost.title} maxWidth="4xl">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-navy-800 text-white font-bold flex items-center justify-center text-sm">
                  {selectedPost.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-navy-900">{selectedPost.authorName}</h4>
                  <p className="text-[11px] text-slate-500">{selectedPost.authorRole}</p>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-500 font-mono">
                <p>{selectedPost.publishedDate}</p>
                <Badge variant="teal" size="sm">{selectedPost.category}</Badge>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-xs text-slate-700 space-y-3 leading-relaxed p-2 border-l-2 border-tealbrand-500">
              {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-1.5 flex-wrap">
                {selectedPost.tags.map(t => (
                  <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    #{t}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedPost(null)}>
                Close Article
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Article Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Publish Clinical Article / Hospital Bulletin" maxWidth="2xl">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <Input label="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Infection Prevention Guidelines 2026" />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white font-medium"
            >
              {['Clinical Protocols', 'Cardiology', 'Hospital Policy', 'Patient Care', 'Wellness & Research'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input label="Author Name & Title" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Summary Lead Paragraph</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Brief summary to highlight in grid cards..."
              className="w-full rounded-lg border border-slate-300 p-3 text-xs bg-white outline-none focus:border-tealbrand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Article Body Content</label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Full clinical bulletin text..."
              className="w-full rounded-lg border border-slate-300 p-3 text-xs bg-white outline-none focus:border-tealbrand-500 font-sans"
            />
          </div>

          <Input label="Tags (comma-separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Protocol, Hygiene, Surgery" />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="teal" type="submit">
              Publish Bulletin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
