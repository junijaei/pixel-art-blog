import { Quote } from '@/components/notion-blocks/Quote/Quote';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { combineRichText, createQuoteBlock, createRichText } from '../__integration__/fixtures';

const meta = {
  title: 'Notion Blocks/Quote',
  component: Quote,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    block: createQuoteBlock(createRichText('The only way to do great work is to love what you do.')),
  },
};

export const WithAuthor: Story = {
  args: {
    block: createQuoteBlock(
      combineRichText(createRichText('Stay hungry, stay foolish. '), createRichText('— Steve Jobs', { bold: true }))
    ),
  },
};

export const LongQuote: Story = {
  name: 'Long Multi-line Quote',
  args: {
    block: createQuoteBlock(
      createRichText(
        'In the long history of humankind (and animal kind, too) those who learned to collaborate and improvise most effectively have prevailed. The future depends on what we do in the present.'
      )
    ),
  },
};

export const LongLongQuote: Story = {
  name: 'Long Multi-line Korean Quote',
  args: {
    block: createQuoteBlock(
      createRichText(
        `곧 배웠다. 미래를 생각하는 건 금기였다. 과거를 생각하는 것도 금기였다. 내다보거나 뒤돌아보는 일 모두 자해였으므로 해서는 안 되는 일이었다. 하루씩만 살자, 하루씩만. 나의 만트라가 된 말. 하루를 보내는 건 어떤 의미에서는 ‘쉬웠다’. 내가 할 수 있는 일과 없는 일은 정해져 있었기 때문이다. 언제 자고 일어나고 먹을지, 무엇을 먹을지, 무엇을 할지, 무엇을 하면 안 되는지 그 모두를 알려주는 고통은 표지였고 조련사였고 온갖 세세한 것을 전부 통제하는 미친 관리자였다. 한편으로는 고통이 정한 루틴은 내게 종교이기도 했다. 루틴만 믿고 따르면 언제나 구원받을 수 있기 때문에. 같은 시간에 일어나 같은 시간에 먹고 자는 일만 할 수 있다면 나는 무너지지 않은 것이다. 사라지고 싶은 마음이 드는 날도 루틴만 지켜지면 괜찮은 것이다. 그러면 아무도 눈치채지 못한다. 나 자신도 속일 수 있다. 신마저도 내가 괜찮은 줄 알 것이다……
그렇게 하루씩이었다. 지겨운 반복, 토 나오는 반복의 하루들. 나는 감옥을 떠올렸고, 등에 핀이 꽂혀 꼼짝 못 하게 된 곤충을 떠올렸고, 주인공이 눈을 뜨면 똑같은 하루가 반복되는 영화를 떠올렸다. 내 생활의 반경이 그리는 원은 점에 가까웠다. 몸이 허락한 그 작은 동그라미 안에서 나는 조금씩 할 수 있는 일들을 했다. 지금도 돌아보기 꺼려지는 검은 구멍 같은 몇 년이 있었다. 그림을 그리고 드라마를 봤다. 말이 돌아오고 있다고 느낀 몇 년이 있었다. “물에 빠져 죽지 않기 위해 헤엄치는 것처럼“ 읽었다. 내가 살아 있는 데 중요했던 말들을 한국어로 번역한 몇 년이 있었다. 번역 작업은 한때 손상되었던 내 언어 능력의 회복을 가늠하는 일이기도 했다. 지금 이 글쓰기는 침대와 책상을 오가며 적은, 조각난 메모들을 엮는 작업이다. 이 조각들을 연결할 에너지가 없었을 때 나는 기다려야 했고, 이 문장들은 매일 두세 시간 책상에 앉아 있을 수 있게 된 지금 이 몸에 의해서만 쓰일 수 있다. 앓기-읽기-쓰기는 너무도 겹쳐 있었다. 나으면서 읽었고 읽으면서 나았으며 나으면서 썼고 쓰면서 나았다. 나는 고통이 가르쳐준 주제에 관해, 오래도록 씹고 삼키기를 거듭해 내 살이 된 말들을 쓴다. 쓰기가 ‘그전’과 ‘그후’로 동강난 삶을 이어줄 것이기에 쓴다.`
      )
    ),
  },
};

export const WithItalic: Story = {
  args: {
    block: createQuoteBlock(
      createRichText('Innovation distinguishes between a leader and a follower.', {
        italic: true,
      })
    ),
  },
};

export const WithMultipleStyles: Story = {
  name: 'Multiple Text Styles',
  args: {
    block: createQuoteBlock(
      combineRichText(
        createRichText('Code is like humor. ', { italic: true }),
        createRichText('When you have to explain it, its bad.', { bold: true })
      )
    ),
  },
};

export const WithLink: Story = {
  args: {
    block: createQuoteBlock(
      combineRichText(
        createRichText('Read more about design systems at '),
        createRichText('our documentation', { link: 'https://example.com/docs' }),
        createRichText('.')
      )
    ),
  },
};

export const WithColor: Story = {
  args: {
    block: createQuoteBlock(createRichText('This is a gray background quote.'), 'gray_background'),
  },
};

export const ColorVariants: Story = {
  name: 'Different Background Colors',
  args: {
    block: createQuoteBlock(createRichText('Gray background quote'), 'gray_background'),
  },
  render: () => (
    <div className="space-y-4">
      <Quote block={createQuoteBlock(createRichText('Gray background quote'), 'gray_background')} />
      <Quote block={createQuoteBlock(createRichText('Blue background quote'), 'blue_background')} />
      <Quote block={createQuoteBlock(createRichText('Yellow background quote'), 'yellow_background')} />
      <Quote block={createQuoteBlock(createRichText('Green background quote'), 'green_background')} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    block: createQuoteBlock([]),
  },
};

export const MultipleQuotes: Story = {
  name: 'Multiple Quotes in Sequence',
  args: {
    block: createQuoteBlock(createRichText('Simplicity is the ultimate sophistication.')),
  },
  render: () => (
    <div className="space-y-4">
      <Quote block={createQuoteBlock(createRichText('Simplicity is the ultimate sophistication.'))} />
      <Quote
        block={createQuoteBlock(
          combineRichText(
            createRichText('Design is not just what it looks like and feels like. '),
            createRichText('Design is how it works.', { bold: true })
          )
        )}
      />
      <Quote block={createQuoteBlock(createRichText('Good design is obvious. Great design is transparent.'))} />
    </div>
  ),
};
