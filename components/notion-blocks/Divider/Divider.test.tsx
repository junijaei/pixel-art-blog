import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('hr 요소를 렌더링한다', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('기본 스타일을 적용한다', () => {
    const { container } = render(<Divider />);
    const wrapper = container.querySelector('div');
    const hr = container.querySelector('hr');

    expect(wrapper).toHaveClass('my-6');
    expect(hr).toHaveClass('border-border');
  });

  it('커스텀 className을 적용한다', () => {
    const { container } = render(<Divider className="custom-class" />);
    const wrapper = container.querySelector('div');

    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveClass('my-6'); // 기본 클래스도 유지
  });

  it('여러 개의 Divider를 렌더링할 수 있다', () => {
    const { container } = render(
      <>
        <Divider />
        <Divider />
        <Divider />
      </>
    );

    const dividers = container.querySelectorAll('hr');
    expect(dividers).toHaveLength(3);
  });

  it('다른 컴포넌트와 함께 사용할 수 있다', () => {
    const { container } = render(
      <div>
        <p>Content above</p>
        <Divider />
        <p>Content below</p>
      </div>
    );

    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });
});
