'use client'

import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faEye, faFire, faStar, faBullhorn, faSpinner, faCheck, faUpload, faTrash, faPalette } from '@fortawesome/free-solid-svg-icons'
import { createClient } from '@/lib/supabase/client'

interface PromoCard {
  badge: string
  headline: string
  subheading: string
  body: string
  buttonLabel: string
  buttonUrl: string
  icon: 'jar' | 'diamond' | 'star' | 'flame'
  imageUrl?: string
  bgStart?: string
  bgEnd?: string
  textColor?: string
}

interface AnnouncementBar {
  text: string
}

interface SiteContent {
  promo_card_1: PromoCard
  promo_card_2: PromoCard
  announcement_bar: AnnouncementBar
}

const DEFAULT_PROMO_1: PromoCard = {
  badge: 'Limited Time',
  headline: '50% OFF',
  subheading: 'On all masala blends',
  body: 'Use code SPICE50 at checkout',
  buttonLabel: 'Buy Now',
  buttonUrl: '/shop',
  icon: 'flame',
  bgStart: '#3B1E08',
  bgEnd: '#7A3D15',
  textColor: '#FFFFFF',
}

const DEFAULT_PROMO_2: PromoCard = {
  badge: 'Fan Favourite',
  headline: '50% OFF',
  subheading: 'Exotic & Rare spices',
  body: 'Desi. Vegan. Powerful.',
  buttonLabel: 'Buy Now',
  buttonUrl: '/shop?category=exotic',
  icon: 'star',
  bgStart: '#C17F24',
  bgEnd: '#E6C672',
  textColor: '#FFFFFF',
}

async function fetchContent(): Promise<SiteContent> {
  const res = await fetch('/api/content')
  if (!res.ok) throw new Error('Failed to load content')
  return res.json()
}

async function saveContent(key: string, value: object): Promise<void> {
  const res = await fetch('/api/content', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  })
  if (!res.ok) throw new Error('Failed to save')
}

function InputField({
  label, value, onChange, placeholder, hint, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; hint?: string; type?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-[500] text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-4
                   text-white text-sm placeholder:text-gray-500
                   focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20
                   transition-all ${type === 'color' ? 'h-11 p-1' : 'h-11'}`}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

function ImageUpload({ 
  currentUrl, 
  onUpload, 
  onRemove 
}: { 
  currentUrl?: string; 
  onUpload: (url: string) => void;
  onRemove: () => void 
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (err: any) {
      alert(`Error uploading image: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-[500] text-gray-300">Banner Image (Optional)</label>
      <div className="flex items-center gap-4">
        {currentUrl ? (
          <div className="relative group">
            <img src={currentUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
            <button 
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-amber-600 hover:text-amber-600 transition-all"
          >
            {uploading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faUpload} />}
            <span className="text-[10px] mt-1">{uploading ? '...' : 'Upload'}</span>
          </button>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <div className="text-xs text-gray-500">
          <p>Recommended size: 800x400px</p>
          <p>Transparency supported (PNG/WebP)</p>
        </div>
      </div>
    </div>
  )
}

function SaveButton({ onClick, saving, saved }: {
  onClick: () => void; saving: boolean; saved: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 px-5 h-10 rounded-lg text-sm font-[600]
                 bg-amber-700 text-white hover:bg-amber-800 active:scale-95
                 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
    >
      {saving ? (
        <><FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" /> Saving...</>
      ) : saved ? (
        <><FontAwesomeIcon icon={faCheck} className="w-4 h-4" /> Saved!</>
      ) : (
        <><FontAwesomeIcon icon={faSave} className="w-4 h-4" /> Save Changes</>
      )}
    </button>
  )
}

function PromoCardEditor({
  title, cardKey, data, onChange,
}: {
  title: string
  cardKey: 'promo_card_1' | 'promo_card_2'
  data: PromoCard
  onChange: (key: 'promo_card_1' | 'promo_card_2', val: PromoCard) => void
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const isCard1 = cardKey === 'promo_card_1'
  
  const update = (field: keyof PromoCard, value: any) => {
    onChange(cardKey, { ...data, [field]: value })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveContent(cardKey, data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const previewStyle = {
    background: `linear-gradient(to bottom right, ${data.bgStart || '#3B1E08'}, ${data.bgEnd || '#7A3D15'})`,
    color: data.textColor || '#FFFFFF'
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          {isCard1
            ? <FontAwesomeIcon icon={faFire} className="w-4 h-4 text-amber-500" />
            : <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-amber-400" />
          }
          <h2 className="text-white font-[600] text-base">{title}</h2>
        </div>
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-4">
          <InputField label="Badge Text" value={data.badge} onChange={(v) => update('badge', v)} placeholder="e.g. Limited Time" hint="Small pill shown above the headline" />
          <InputField label="Headline" value={data.headline} onChange={(v) => update('headline', v)} placeholder="e.g. 50% OFF" hint="Large bold text, keep it short" />
          <InputField label="Subheading" value={data.subheading} onChange={(v) => update('subheading', v)} placeholder="e.g. On all masala blends" />
          <InputField label="Body Text" value={data.body} onChange={(v) => update('body', v)} placeholder="e.g. Use code SPICE50 at checkout" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Button Label" value={data.buttonLabel} onChange={(v) => update('buttonLabel', v)} placeholder="e.g. Buy Now" />
            <InputField label="Button URL" value={data.buttonUrl} onChange={(v) => update('buttonUrl', v)} placeholder="e.g. /shop" hint="Relative path" />
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
              <FontAwesomeIcon icon={faPalette} className="text-amber-500" />
              Theme & Colors
            </label>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="BG Start" value={data.bgStart || '#000'} onChange={(v) => update('bgStart', v)} type="color" />
              <InputField label="BG End" value={data.bgEnd || '#000'} onChange={(v) => update('bgEnd', v)} type="color" />
              <InputField label="Text Color" value={data.textColor || '#fff'} onChange={(v) => update('textColor', v)} type="color" />
            </div>
            <div className="mt-4">
              <ImageUpload 
                currentUrl={data.imageUrl} 
                onUpload={(url) => update('imageUrl', url)} 
                onRemove={() => update('imageUrl', '')} 
              />
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-[500] uppercase tracking-wider">Live Preview</span>
          </div>
          <div style={previewStyle} className={`relative rounded-2xl p-6 sm:p-8 overflow-hidden min-h-[220px] transition-all`}>
            {/* Background Image / Icon */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20 pointer-events-none scale-125">
              {data.imageUrl ? (
                <img src={data.imageUrl} className="w-full h-full object-contain" alt="" />
              ) : (
                isCard1 ? <FontAwesomeIcon icon={faFire} className="w-full h-full" /> : <FontAwesomeIcon icon={faStar} className="w-full h-full" />
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 bg-black/20 text-white text-xs font-[600] px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              {isCard1 ? <FontAwesomeIcon icon={faFire} className="w-3 h-3 text-amber-500" /> : <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-amber-300" />}
              {data.badge || 'Badge'}
            </span>
            <div className="text-4xl font-[800] leading-none mb-1">{data.headline || 'Headline'}</div>
            <div className="font-[700] text-sm mb-1">{data.subheading || 'Subheading'}</div>
            <div className="opacity-80 text-sm mb-5">{data.body || 'Body text'}</div>
            <button className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-bold px-5 py-2 rounded-full shadow-lg">
              {data.buttonLabel || 'Button'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnnouncementEditor({ data, onChange }: {
  data: AnnouncementBar; onChange: (val: AnnouncementBar) => void
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveContent('announcement_bar', data)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon icon={faBullhorn} className="w-4 h-4 text-amber-500" />
          <h2 className="text-white font-[600] text-base">Announcement Bar</h2>
        </div>
        <SaveButton onClick={handleSave} saving={saving} saved={saved} />
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        <InputField
          label="Announcement Text"
          value={data.text}
          onChange={(v) => { onChange({ text: v }); setSaved(false) }}
          placeholder="Free shipping on orders | 100% Pure & Natural"
          hint="Separate sections with  |  (pipe character)."
        />
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-[500] uppercase tracking-wider">Preview</span>
          </div>
          <div className="bg-amber-700 text-white text-sm font-[500] text-center py-2.5 px-4 rounded-lg truncate">
            {data.text || 'Announcement text will appear here'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminUpdatesClient() {
  const [content, setContent] = useState<SiteContent>({
    promo_card_1: DEFAULT_PROMO_1,
    promo_card_2: DEFAULT_PROMO_2,
    announcement_bar: { text: '' },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContent()
      .then((data) => {
        setContent({
          promo_card_1: data.promo_card_1 as PromoCard ?? DEFAULT_PROMO_1,
          promo_card_2: data.promo_card_2 as PromoCard ?? DEFAULT_PROMO_2,
          announcement_bar: data.announcement_bar as AnnouncementBar ?? { text: '' },
        })
      })
      .catch(() => setError('Failed to load site content. Please check your Supabase connection.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-xl text-red-400 text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-white text-2xl font-[700]">Site Content</h1>
        <p className="text-gray-400 text-sm mt-1">
          Customize homepage promo cards, colors, and the announcement bar. Changes go live instantly.
        </p>
      </div>
      <AnnouncementEditor
        data={content.announcement_bar}
        onChange={(val) => setContent((prev) => ({ ...prev, announcement_bar: val }))}
      />
      <div className="grid grid-cols-1 gap-6">
        <PromoCardEditor
          title="Promo Card 1"
          cardKey="promo_card_1"
          data={content.promo_card_1}
          onChange={(key, val) => setContent((prev) => ({ ...prev, [key]: val }))}
        />
        <PromoCardEditor
          title="Promo Card 2"
          cardKey="promo_card_2"
          data={content.promo_card_2}
          onChange={(key, val) => setContent((prev) => ({ ...prev, [key]: val }))}
        />
      </div>
    </div>
  )
}
