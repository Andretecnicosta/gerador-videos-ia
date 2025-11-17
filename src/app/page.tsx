"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Video, 
  Music, 
  User, 
  Settings,
  Sparkles,
  Upload,
  Eye,
  Clock,
  Zap,
  Crown,
  Check,
  X,
  Star,
  Shield,
  Infinity
} from 'lucide-react'

interface VideoConfig {
  avatar: string
  voice: string
  music: string
  duration: number
  style: string
  format: string
}

interface GenerationStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed'
  progress: number
}

type PlanType = 'free' | 'pro'

interface PlanFeatures {
  name: string
  price: string
  features: string[]
  limitations?: string[]
}

export default function VideoGeneratorApp() {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [videoConfig, setVideoConfig] = useState<VideoConfig>({
    avatar: 'professional',
    voice: 'natural-female',
    music: 'upbeat',
    duration: 30,
    style: 'modern',
    format: 'vertical'
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const plans: Record<PlanType, PlanFeatures> = {
    free: {
      name: 'Gratuito',
      price: 'R$ 0',
      features: [
        'Até 3 vídeos por mês',
        'Duração máxima: 30s',
        'Avatares básicos',
        'Vozes padrão',
        'Formatos básicos'
      ],
      limitations: [
        'Marca d\'água no vídeo',
        'Qualidade HD limitada'
      ]
    },
    pro: {
      name: 'Profissional',
      price: 'R$ 29,90/mês',
      features: [
        'Vídeos ilimitados',
        'Duração até 5 minutos',
        'Avatares premium',
        'Vozes profissionais',
        'Todos os formatos',
        'Sem marca d\'água',
        'Qualidade 4K',
        'Música premium',
        'Suporte prioritário',
        'Exportação em lote'
      ]
    }
  }

  const generationSteps: GenerationStep[] = [
    { id: 'text', name: 'Processando texto', status: 'pending', progress: 0 },
    { id: 'voice', name: 'Gerando voz natural', status: 'pending', progress: 0 },
    { id: 'avatar', name: 'Criando avatar', status: 'pending', progress: 0 },
    { id: 'subtitles', name: 'Gerando legendas', status: 'pending', progress: 0 },
    { id: 'music', name: 'Adicionando música', status: 'pending', progress: 0 },
    { id: 'render', name: 'Renderizando vídeo', status: 'pending', progress: 0 }
  ]

  const [steps, setSteps] = useState(generationSteps)

  useEffect(() => {
    // Inicializar reconhecimento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'pt-BR'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setText(prev => prev + finalTranscript + ' ')
        }
      }
    }
  }, [])

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false)
      recognitionRef.current.stop()
    }
  }

  const canGenerate = () => {
    if (currentPlan === 'free') {
      // Simular limite de 3 vídeos por mês para usuário gratuito
      return true // Para demo, sempre permitir
    }
    return true
  }

  const generateVideo = async () => {
    if (!text.trim()) return
    
    if (!canGenerate()) {
      setShowUpgradeModal(true)
      return
    }

    setIsGenerating(true)
    setCurrentStep(0)
    
    // Simular processo de geração
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      setSteps(prev => prev.map((step, index) => 
        index === i 
          ? { ...step, status: 'processing', progress: 0 }
          : index < i 
            ? { ...step, status: 'completed', progress: 100 }
            : step
      ))

      // Simular progresso da etapa atual
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, progress } : step
        ))
      }

      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed', progress: 100 } : step
      ))
    }

    // Simular vídeo gerado
    setGeneratedVideo('/api/placeholder-video.mp4')
    setIsGenerating(false)
  }

  const shareVideo = () => {
    if (navigator.share && generatedVideo) {
      navigator.share({
        title: 'Meu vídeo gerado por IA',
        text: 'Confira este vídeo que criei com VideoIA Creator!',
        url: generatedVideo
      })
    }
  }

  const downloadVideo = () => {
    if (generatedVideo) {
      const link = document.createElement('a')
      link.href = generatedVideo
      link.download = `video-ia-${currentPlan === 'free' ? 'watermark' : 'pro'}.mp4`
      link.click()
    }
  }

  const upgradeToPro = () => {
    // Simular upgrade
    setCurrentPlan('pro')
    setShowUpgradeModal(false)
    // Aqui integraria com sistema de pagamento (Stripe, etc.)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Profissional */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VideoIA Creator</h1>
                <p className="text-sm text-gray-600">Plataforma profissional de vídeos com IA</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge 
                variant={currentPlan === 'pro' ? 'default' : 'secondary'}
                className={`px-3 py-1 ${
                  currentPlan === 'pro' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {currentPlan === 'pro' ? (
                  <>
                    <Crown className="w-4 h-4 mr-1" />
                    PRO
                  </>
                ) : (
                  'GRATUITO'
                )}
              </Badge>
              
              {currentPlan === 'free' && (
                <Button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade PRO
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transforme ideias em vídeos profissionais
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Crie conteúdo de alta qualidade para suas redes sociais usando inteligência artificial. 
            Sem necessidade de câmera, edição ou conhecimento técnico.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Voz natural</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Avatar profissional</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Legendas automáticas</span>
            </div>
            <div className="flex items-center gap-2 text-orange-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Música integrada</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-blue-600" />
                    Conteúdo do Vídeo
                  </div>
                  {currentPlan === 'free' && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Plano Gratuito
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Texto</TabsTrigger>
                    <TabsTrigger value="voice">Gravação de Voz</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <Textarea
                      placeholder="Digite seu roteiro aqui... Ex: 'Olá! Hoje vou compartilhar 3 estratégias comprovadas para aumentar suas vendas online em 30 dias...'"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="min-h-32 text-base resize-none"
                      maxLength={currentPlan === 'free' ? 500 : 2000}
                    />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {text.length}/{currentPlan === 'free' ? 500 : 2000} caracteres
                      </span>
                      {currentPlan === 'free' && text.length > 400 && (
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => setShowUpgradeModal(true)}
                          className="text-blue-600 p-0 h-auto"
                        >
                          Upgrade para mais caracteres
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voice" className="space-y-4">
                    <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        size="lg"
                        className={`w-16 h-16 rounded-full ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-6 h-6" />
                        ) : (
                          <Mic className="w-6 h-6" />
                        )}
                      </Button>
                      <p className="mt-4 text-gray-700 font-medium">
                        {isRecording ? 'Gravando... Clique para parar' : 'Clique para gravar'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentPlan === 'free' ? 'Máx. 30 segundos' : 'Até 5 minutos'}
                      </p>
                    </div>
                    {text && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium mb-2">Texto transcrito:</p>
                        <p className="text-gray-800">{text}</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Configurações Avançadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Avatar</label>
                    <Select value={videoConfig.avatar} onValueChange={(value) => 
                      setVideoConfig(prev => ({ ...prev, avatar: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">👔 Executivo</SelectItem>
                        <SelectItem value="casual">👕 Casual</SelectItem>
                        <SelectItem value="creative">🎨 Criativo</SelectItem>
                        {currentPlan === 'pro' && (
                          <>
                            <SelectItem value="tech">💻 Tech Expert</SelectItem>
                            <SelectItem value="influencer">⭐ Influencer</SelectItem>
                            <SelectItem value="doctor">👩‍⚕️ Médico</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {currentPlan === 'free' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Mais avatares no plano PRO
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Voz</label>
                    <Select value={videoConfig.voice} onValueChange={(value) => 
                      setVideoConfig(prev => ({ ...prev, voice: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural-female">🗣️ Ana (Feminina)</SelectItem>
                        <SelectItem value="natural-male">🗣️ Carlos (Masculina)</SelectItem>
                        {currentPlan === 'pro' && (
                          <>
                            <SelectItem value="energetic">⚡ Júlia (Energética)</SelectItem>
                            <SelectItem value="calm">😌 Roberto (Calma)</SelectItem>
                            <SelectItem value="professional">💼 Mariana (Executiva)</SelectItem>
                            <SelectItem value="young">🌟 Pedro (Jovem)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Trilha Sonora</label>
                    <Select value={videoConfig.music} onValueChange={(value) => 
                      setVideoConfig(prev => ({ ...prev, music: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upbeat">🎵 Motivacional</SelectItem>
                        <SelectItem value="corporate">🏢 Corporativa</SelectItem>
                        <SelectItem value="chill">😎 Relaxante</SelectItem>
                        {currentPlan === 'pro' && (
                          <>
                            <SelectItem value="epic">🎬 Épica</SelectItem>
                            <SelectItem value="tech">🤖 Tecnológica</SelectItem>
                            <SelectItem value="acoustic">🎸 Acústica</SelectItem>
                          </>
                        )}
                        <SelectItem value="none">🔇 Sem música</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Formato</label>
                    <Select value={videoConfig.format} onValueChange={(value) => 
                      setVideoConfig(prev => ({ ...prev, format: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vertical">📱 Stories (9:16)</SelectItem>
                        <SelectItem value="square">⬜ Feed (1:1)</SelectItem>
                        {currentPlan === 'pro' && (
                          <>
                            <SelectItem value="horizontal">🖥️ YouTube (16:9)</SelectItem>
                            <SelectItem value="tiktok">🎵 TikTok Otimizado</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center justify-between">
                    <span>Duração: {videoConfig.duration}s</span>
                    {currentPlan === 'free' && (
                      <span className="text-xs text-orange-600">Máx. 30s no plano gratuito</span>
                    )}
                  </label>
                  <Slider
                    value={[videoConfig.duration]}
                    onValueChange={(value) => 
                      setVideoConfig(prev => ({ ...prev, duration: value[0] }))
                    }
                    max={currentPlan === 'free' ? 30 : 300}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="space-y-4">
              <Button
                onClick={generateVideo}
                disabled={!text.trim() || isGenerating}
                size="lg"
                className="w-full h-16 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
                    Gerando Vídeo Profissional...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Gerar Vídeo com IA
                  </>
                )}
              </Button>
              
              {currentPlan === 'free' && (
                <p className="text-center text-sm text-gray-600">
                  ⚠️ Vídeos gratuitos incluem marca d'água • 
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Remover com PRO
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Preview & Plans Section */}
          <div className="space-y-6">
            {/* Generation Progress */}
            {isGenerating && (
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Processamento IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'processing' ? 'text-blue-600' :
                          'text-gray-500'
                        }`}>
                          {step.name}
                        </span>
                        <span className="text-xs font-medium">
                          {step.status === 'completed' ? '✓' : 
                           step.status === 'processing' ? `${step.progress}%` : '⏳'}
                        </span>
                      </div>
                      <Progress 
                        value={step.progress} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Video Preview */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-green-600" />
                  Preview do Vídeo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedVideo ? (
                  <div className="space-y-4">
                    <div className="aspect-[9/16] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center relative overflow-hidden border-2 border-gray-200">
                      <div className="text-center p-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                          <User className="w-10 h-10 text-blue-600" />
                        </div>
                        <div className="space-y-3 mb-6">
                          <div className="h-2 bg-white/70 rounded w-4/5 mx-auto"></div>
                          <div className="h-2 bg-white/70 rounded w-3/5 mx-auto"></div>
                          <div className="h-2 bg-white/70 rounded w-4/5 mx-auto"></div>
                        </div>
                        <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg">
                          {text.slice(0, 60)}...
                        </div>
                      </div>
                      
                      {/* Watermark for free users */}
                      {currentPlan === 'free' && (
                        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          VideoIA Creator
                        </div>
                      )}
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/60 text-white text-xs p-2 rounded-lg backdrop-blur-sm">
                          🎵 {videoConfig.music === 'none' ? 'Sem música' : 'Com trilha sonora'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={downloadVideo} className="bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={shareVideo} variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                    
                    {currentPlan === 'free' && (
                      <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-700 mb-2">
                          <Crown className="w-4 h-4 inline mr-1" />
                          Vídeo com marca d'água
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => setShowUpgradeModal(true)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                          Remover marca d'água
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[9/16] bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Seu vídeo aparecerá aqui</p>
                      <p className="text-sm">Digite um texto e clique em gerar</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plans Comparison */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                  <h3 className="text-xl font-bold mb-2">Upgrade para PRO</h3>
                  <p className="text-blue-100">Desbloqueie todo o potencial da plataforma</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">Vídeos sem marca d'água</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">Qualidade 4K profissional</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">Vídeos ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">Avatares e vozes premium</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">Duração até 5 minutos</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold"
                >
                  Começar Teste Gratuito
                </Button>
                
                <p className="text-center text-xs text-blue-200 mt-3">
                  7 dias grátis • Cancele quando quiser
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Escolha seu plano</h2>
                  <p className="text-gray-600">Desbloqueie recursos profissionais</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Gratuito</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">R$ 0</div>
                    <p className="text-gray-600">Para começar</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {plans.free.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plans.free.limitations?.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={currentPlan === 'free'}
                  >
                    {currentPlan === 'free' ? 'Plano Atual' : 'Plano Gratuito'}
                  </Button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-blue-500 rounded-xl p-6 relative bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      MAIS POPULAR
                    </Badge>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      Profissional
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">R$ 29,90</div>
                    <p className="text-gray-600">por mês</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {plans.pro.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={upgradeToPro}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-3"
                  >
                    {currentPlan === 'pro' ? 'Plano Atual' : 'Começar Teste Gratuito'}
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500 mt-3">
                    7 dias grátis • Cancele quando quiser
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Pagamento seguro • Suporte 24/7 • Garantia de 30 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}