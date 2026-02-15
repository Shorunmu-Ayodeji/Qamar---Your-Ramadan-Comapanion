import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoodSelector from '../components/MoodSelector';

describe('MoodSelector Component', () => {
  const mockOnMoodChange = jest.fn();

  beforeEach(() => {
    mockOnMoodChange.mockClear();
  });

  test('renders all mood options', () => {
    render(<MoodSelector selectedMood="" onMoodChange={mockOnMoodChange} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  test('calls onMoodChange when mood is selected', async () => {
    render(<MoodSelector selectedMood="" onMoodChange={mockOnMoodChange} />);
    
    const peacefulButton = screen.getByLabelText('Select Peaceful mood');
    fireEvent.click(peacefulButton);
    
    expect(mockOnMoodChange).toHaveBeenCalledWith('peaceful');
  });

  test('highlights selected mood', () => {
    render(<MoodSelector selectedMood="happy" onMoodChange={mockOnMoodChange} />);
    
    const happyButton = screen.getByLabelText('Select Happy mood');
    expect(happyButton).toHaveClass('bg-ramadan-100');
  });

  test('supports keyboard navigation', async () => {
    render(<MoodSelector selectedMood="" onMoodChange={mockOnMoodChange} />);
    
    const peacefulButton = screen.getByLabelText('Select Peaceful mood');
    peacefulButton.focus();
    
    fireEvent.keyDown(peacefulButton, { key: 'Enter' });
    expect(mockOnMoodChange).toHaveBeenCalledWith('peaceful');
  });

  test('accessible with aria labels', () => {
    render(<MoodSelector selectedMood="peaceful" onMoodChange={mockOnMoodChange} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-pressed');
    });
  });
});
