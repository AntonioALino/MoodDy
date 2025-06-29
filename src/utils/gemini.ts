import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import dotenv from 'dotenv';
import { text } from 'express';

dotenv.config(); 

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("ERRO: A variável de ambiente GEMINI_API_KEY não está configurada.");
  process.exit(1); 
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Inicializa o modelo Gemini
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configurações de segurança (opcional, mas recomendado para evitar conteúdo indesejado)
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];


interface GeminiAnalysisResult {
  aiInferredEmotion: string; 
  suggestedActivities: string[]; 
}

/**
 * Gera um prompt para o Gemini para analisar o sentimento e gerar sugestões de atividades.
 * @param diaryText O texto completo do diário do usuário.
 * @returns Uma string de prompt formatada.
 */
function createCombinedAnalysisPrompt(diaryText: string): string {
  // Este é um prompt crucial. Ele instrui o Gemini a fazer as duas coisas.
  // Peça o formato JSON para facilitar o parsing no backend.
  return `Você é um analista de emoções e um assistente de bem-estar.
  Analise o seguinte texto do diário em português com extrema atenção ao sentimento e emoção.

  1. **Análise de Emoção:**
     Identifique a emoção **mais predominante e forte** no texto.
     **SEMPRE retorne uma emoção específica.**
     Escolha um termo único e simples da seguinte lista:
     'alegria', 'tristeza', 'raiva', 'ansiedade', 'frustração', 'esperança', 'cansaço', 'calma', 'gratidão', 'desânimo', 'confusão'.
     Use 'neutro' SOMENTE se o texto não expressar nenhuma emoção clara ou se for factual.

  2. **Sugestões de Atividades:**
     Com base na emoção identificada, sugira 3 atividades diferentes que a pessoa possa fazer **fora do computador**.
     As sugestões devem ser criativas, gentis, práticas, e adaptadas ao estado emocional e ao contexto de Sorocaba, São Paulo, Brasil.

  **Sua resposta DEVE ser estritamente um objeto JSON com as seguintes chaves, SEM NENHUM TEXTO ADICIONAL, INTRODUÇÃO OU EXPLICAÇÃO FORA DO JSON:**
  {
    "aiInferredEmotion": "string (a emoção detectada)",
    "suggestedActivities": ["string (sugestão 1)", "string (sugestão 2)", "string (sugestão 3)"]
  }

  Exemplo de texto para 'alegria': "Hoje foi um dia maravilhoso, me sinto muito grato por tudo que aconteceu, o sol estava perfeito!"
  Exemplo de resposta JSON para 'alegria':
  {
    "aiInferredEmotion": "alegria",
    "suggestedActivities": [
      "Aproveitar o dia ensolarado no Parque do Campolim em Sorocaba.",
      "Compartilhar sua gratidão e alegria com alguém especial.",
      "Planejar um novo passeio de bicicleta na ciclovia de Sorocaba."
    ]
  }

  Exemplo de texto para 'tristeza': "Hoje, a chuva lá fora reflete exatamente como me sinto por dentro. Uma tristeza profunda parece ter se instalado, e tudo que vejo me lembra do que perdi."
  Exemplo de resposta JSON para 'tristeza':
  {
    "aiInferredEmotion": "tristeza",
    "suggestedActivities": [
      "Ouvir uma playlist de músicas que te confortam e permitem processar a emoção.",
      "Escrever livremente sobre seus sentimentos em um diário, sem julgamento.",
      "Fazer uma caminhada leve em um local tranquilo em Sorocaba, como o Jardim Botânico."
    ]
  }
  Texto a ser analisado: "${diaryText}"`;
}

/**
 * Solicita ao Gemini API para analisar o sentimento e gerar sugestões de atividades.
 * @param diaryText O texto do diário do usuário.
 * @returns Uma Promise que resolve para um objeto GeminiAnalysisResult.
 */
export async function analyzeSentimentAndSuggestActivities(diaryText: string): Promise<GeminiAnalysisResult> {
  try {
    const prompt = createCombinedAnalysisPrompt(diaryText);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      safetySettings: safetySettings,
    });

    const response = await result.response;
    const text = response.text(); // Obtém o texto gerado pelo Gemini (espera-se JSON)

    // O Gemini pode incluir formatação Markdown ou texto extra, então vamos limpar.
    // Remover ```json e ``` se estiverem presentes.
    let cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();

    // Tenta fazer o parse do JSON
    const parsedResult: GeminiAnalysisResult = JSON.parse(cleanedText);

    // Validação básica da estrutura (opcional, mas bom para robustez)
    if (!parsedResult.aiInferredEmotion || !Array.isArray(parsedResult.suggestedActivities)) {
      throw new Error('Formato de resposta JSON inesperado do Gemini.');
    }

    return parsedResult;

  } catch (error) {
    console.error('Erro ao chamar o Gemini API para análise e sugestões:', error);
    // Em caso de erro, retorne um resultado padrão ou um erro para a rota lidar
    return {
      aiInferredEmotion: 'neutro',
      suggestedActivities: ['Ocorreu um erro ao gerar sugestões. Que tal fazer algo que você gosta?'],
    };
  }
}